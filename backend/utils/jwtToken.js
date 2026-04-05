export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
   const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
