import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { defaultDoctors } from "../data/defaultDoctors.js";

const getOAuthRedirectBase = () =>
  process.env.OAUTH_SUCCESS_REDIRECT ||
  process.env.FRONTEND_URL_ONE ||
  "http://localhost:5173";

const getGoogleRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.BACKEND_URL || "http://localhost:5000"}/api/v1/user/oauth/google/callback`;

const getGithubRedirectUri = () =>
  process.env.GITHUB_REDIRECT_URI ||
  `${process.env.BACKEND_URL || "http://localhost:5000"}/api/v1/user/oauth/github/callback`;

const ensureDefaultDoctors = async () => {
  const doctorCount = await User.countDocuments({ role: "Doctor" });
  if (doctorCount > 0) {
    return;
  }

  await User.insertMany(
    defaultDoctors.map((doctor) => ({
      ...doctor,
      password: "doctor123",
      role: "Doctor",
    }))
  );
};

const completeOAuthLogin = (user, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  const isProduction = process.env.NODE_ENV === "production";

  res
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    })
    .redirect(`${getOAuthRedirectBase()}?oauth=success`);
};

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { name, firstName, email, phone, gender, password } = req.body;
  const trimmedName = (name || firstName || "").trim();
  if (!trimmedName || !email || !phone || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (isRegistered) {
    return next(
      new ErrorHandler("User with this email or mobile number already exists!", 400)
    );
  }

  const user = await User.create({
    firstName: trimmedName,
    lastName: "",
    email,
    phone,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, phone, identifier, password, role } = req.body;
  const loginValue = (identifier || email || phone || "").trim();
  if (!loginValue || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const query =
    role === "Patient"
      ? {
          $or: [{ email: loginValue.toLowerCase() }, { phone: loginValue }],
        }
      : { email: loginValue.toLowerCase() };

  const user = await User.findOne(query).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid login details or password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid login details or password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone,  dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  await ensureDefaultDoctors();
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const beginGoogleOAuth = catchAsyncErrors(async (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return next(new ErrorHandler("Google login is not configured yet.", 500));
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

export const handleGoogleOAuth = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return next(new ErrorHandler("Google authorization code is missing.", 400));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    return next(new ErrorHandler("Google login failed to exchange token.", 500));
  }

  const profileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );
  const profile = await profileResponse.json();

  if (!profileResponse.ok || !profile.email) {
    return next(new ErrorHandler("Unable to fetch Google profile.", 500));
  }

  let user = await User.findOne({
    $or: [{ email: profile.email.toLowerCase() }, { providerId: profile.id }],
  });

  if (!user) {
    user = await User.create({
      firstName: profile.given_name || profile.name || "Google User",
      lastName: profile.family_name || "",
      email: profile.email.toLowerCase(),
      phone: `9${String(Date.now()).slice(-9)}`,
      gender: "Male",
      password: `oauth-google-${Date.now()}`,
      role: "Patient",
      authProvider: "google",
      providerId: profile.id,
    });
  }

  completeOAuthLogin(user, res);
});

export const beginGithubOAuth = catchAsyncErrors(async (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return next(new ErrorHandler("GitHub login is not configured yet.", 500));
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: getGithubRedirectUri(),
    scope: "read:user user:email",
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

export const handleGithubOAuth = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return next(new ErrorHandler("GitHub authorization code is missing.", 400));
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: getGithubRedirectUri(),
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    return next(new ErrorHandler("GitHub login failed to exchange token.", 500));
  }

  const profileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "ZeeCarePlus",
    },
  });
  const profile = await profileResponse.json();

  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "ZeeCarePlus",
    },
  });
  const emails = await emailResponse.json();
  const primaryEmail =
    Array.isArray(emails) &&
    (emails.find((item) => item.primary)?.email || emails[0]?.email);

  if (!profileResponse.ok || !primaryEmail) {
    return next(new ErrorHandler("Unable to fetch GitHub profile.", 500));
  }

  const [firstName, ...restName] = (profile.name || profile.login || "GitHub User").split(" ");

  let user = await User.findOne({
    $or: [{ email: primaryEmail.toLowerCase() }, { providerId: String(profile.id) }],
  });

  if (!user) {
    user = await User.create({
      firstName: firstName || "GitHub",
      lastName: restName.join(" "),
      email: primaryEmail.toLowerCase(),
      phone: `8${String(Date.now()).slice(-9)}`,
      gender: "Male",
      password: `oauth-github-${Date.now()}`,
      role: "Patient",
      authProvider: "github",
      providerId: String(profile.id),
    });
  }

  completeOAuthLogin(user, res);
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});
