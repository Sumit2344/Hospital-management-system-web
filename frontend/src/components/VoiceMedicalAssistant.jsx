import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaMicrophoneLines, FaVolumeHigh } from "react-icons/fa6";

const responses = {
  en: {
    title: "Medical Voice Helper",
    subtitle: "Tap the mic and describe your problem in English or Hindi.",
    ask: "Please tell me your medical problem. I will try to guide you.",
    unsupported:
      "Voice support is not available in this browser. Please use Chrome on mobile or desktop.",
    listening: "Listening now...",
    noInput: "I could not hear clearly. Please try again.",
    typePrompt: "You can also type your medical problem below.",
    typePlaceholder: "Type your symptom here",
    fallback:
      "I understood this as a general medical concern. Please book an appointment so a doctor can review your symptoms safely.",
    emergency:
      "If there is severe pain, breathing trouble, chest pain, fainting, or heavy bleeding, go to emergency care immediately.",
    suggestions: {
      fever:
        "For fever, rest, drink fluids, and monitor temperature. If fever is high or lasts more than two days, book a doctor appointment.",
      cough:
        "For cough or cold symptoms, stay hydrated and check breathing difficulty. If cough is strong, lasts many days, or there is wheezing, book respiratory or ENT care.",
      skin:
        "For skin allergy, itching, or rash, dermatology is the best first step. Avoid self-medicating with strong creams without advice.",
      heart:
        "For chest discomfort, fast heartbeat, or blood pressure issues, choose cardiology quickly. If chest pain is severe, seek emergency help now.",
      stomach:
        "For acidity, stomach pain, vomiting, or loose motion, keep fluids up and choose digestive support or general consultation.",
      bone:
        "For bone pain, back pain, swelling, or injury, orthopedics or physical therapy may help. Avoid heavy movement until checked.",
      child:
        "For baby or child fever, cough, weakness, or feeding problems, pediatrics is the right department.",
      diabetes:
        "For sugar concerns, weakness, or medicine review, choose diabetes or general physician support and keep your recent reports ready.",
      headache:
        "For repeated headache, dizziness, weakness, or numbness, neurology consultation is recommended.",
      weakness:
        "For weakness, tiredness, body fatigue, or low energy, rest well, keep fluids up, and consider a general physician check if it continues.",
      breathing:
        "For breathing trouble, wheezing, chest tightness, or low oxygen concerns, seek urgent respiratory care. Severe breathing trouble needs emergency help.",
      dental:
        "For tooth pain, gum swelling, mouth infection, or jaw pain, a dental consultation is recommended.",
    },
  },
  hi: {
    title: "Medical Voice Helper",
    subtitle: "Mic dabao aur apni problem Hindi ya English me bolo.",
    ask: "Apni medical problem batayiye. Main aapko basic guidance dunga.",
    unsupported:
      "Is browser me voice support available nahi hai. Kripya Chrome use karein.",
    listening: "Sun raha hoon...",
    noInput: "Aawaz clear nahi mili. Kripya dobara boliye.",
    typePrompt: "Aap niche apni medical problem type bhi kar sakte hain.",
    typePlaceholder: "Yahan apni problem likhiye",
    fallback:
      "Mujhe ye ek general medical problem lag rahi hai. Safe guidance ke liye appointment book kijiye taaki doctor aapki problem check kar sake.",
    emergency:
      "Agar tez dard, saans ki dikkat, chest pain, behoshi, ya heavy bleeding ho to turant emergency care lijiye.",
    suggestions: {
      fever:
        "Bukhar ke liye rest kijiye, paani pijiyega, aur temperature check kijiye. Agar bukhar zyada ho ya do din se zyada rahe to doctor se milna zaruri hai.",
      cough:
        "Khansi ya cold ke liye hydration rakhiye aur breathing problem check kijiye. Agar khansi zyada ho ya wheezing ho to ENT ya respiratory doctor dikhaiye.",
      skin:
        "Skin allergy, itching, ya rash ke liye dermatology best rahega. Strong cream bina advice ke use na karein.",
      heart:
        "Chest discomfort, heartbeat issue, ya BP problem me cardiology choose kijiye. Agar chest pain severe ho to turant emergency lijiye.",
      stomach:
        "Acidity, pet dard, ulti, ya loose motion me fluids rakhiye aur digestive ya general consultation lijiye.",
      bone:
        "Haddi, joint, back pain, swelling, ya injury me orthopedics ya physical therapy helpful rahegi.",
      child:
        "Bacche ko fever, cough, weakness, ya feeding issue ho to pediatrics sahi rahega.",
      diabetes:
        "Sugar problem, weakness, ya medicine review ke liye diabetes support ya general physician choose kijiye.",
      headache:
        "Bar bar headache, chakkar, weakness, ya sunnpan ho to neurology consultation lena sahi rahega.",
      weakness:
        "Kamzori, thakan, body fatigue, ya low energy me rest kijiye, fluids rakhiye, aur agar ye continue ho to general physician se milna sahi rahega.",
      breathing:
        "Saans ki dikkat, wheezing, chest tightness, ya oxygen concern me respiratory care zaruri hai. Severe breathing issue me emergency lijiye.",
      dental:
        "Daant dard, gums swelling, mouth infection, ya jaw pain me dental consultation lena sahi rahega.",
    },
  },
};

const keywordGroups = {
  fever: ["fever", "bukhar", "temperature"],
  cough: ["cough", "cold", "khansi", "sardi", "wheezing", "throat"],
  skin: ["skin", "itch", "itching", "rash", "allergy", "pimples", "daad", "khujli"],
  heart: ["heart", "chest", "bp", "pressure", "heartbeat", "dil", "chest pain"],
  stomach: ["stomach", "acidity", "gas", "pet", "vomit", "ulti", "loose motion", "diarrhea"],
  bone: ["back pain", "bone", "joint", "knee", "injury", "fracture", "haddi", "pain"],
  child: ["child", "baby", "kid", "baccha", "bacha"],
  diabetes: ["diabetes", "sugar", "glucose"],
  headache: ["headache", "migraine", "dizziness", "chakkar", "numbness", "sir dard"],
  weakness: ["weakness", "tired", "fatigue", "kamzori", "thakan", "low energy"],
  breathing: ["breathing", "saans", "oxygen", "asthma", "wheezing", "breathless"],
  dental: ["tooth", "teeth", "dental", "gums", "daant", "mouth pain"],
};

const VoiceMedicalAssistant = () => {
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [heardText, setHeardText] = useState("");
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);
  const [typedQuestion, setTypedQuestion] = useState("");
  const recognitionRef = useRef(null);

  const content = useMemo(() => responses[language], [language]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis?.getVoices?.() || []);
    };

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const getPreferredVoice = () => {
    const languageMatches = voices.filter((voice) =>
      language === "hi"
        ? voice.lang.toLowerCase().includes("hi")
        : voice.lang.toLowerCase().includes("en")
    );

    const femaleVoice = languageMatches.find((voice) => {
      const name = voice.name.toLowerCase();
      return (
        name.includes("female") ||
        name.includes("woman") ||
        name.includes("zira") ||
        name.includes("samantha") ||
        name.includes("heera") ||
        name.includes("priya") ||
        name.includes("swara") ||
        name.includes("lekha") ||
        name.includes("kajal") ||
        name.includes("neha") ||
        name.includes("india")
      );
    });

    return femaleVoice || languageMatches[0] || null;
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    const matchedVoice = getPreferredVoice();
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  };

  const buildReply = (text) => {
    const lower = text.toLowerCase();
    const match = Object.entries(keywordGroups).find(([, words]) =>
      words.some((word) => lower.includes(word))
    );

    if (!match) {
      return `${content.fallback} ${content.emergency}`;
    }

    const [key] = match;
    return `${content.suggestions[key]} ${content.emergency}`;
  };

  const handleMedicalQuery = (text) => {
    const cleanText = text.trim();
    setHeardText(cleanText);
    const nextReply = cleanText ? buildReply(cleanText) : content.noInput;
    setReply(nextReply);
    speak(nextReply);
  };

  const startListening = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setReply(content.unsupported);
      speak(content.unsupported);
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setReply(content.listening);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results || [])
        .filter((result) => result.isFinal)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      handleMedicalQuery(transcript);
    };

    recognition.onnomatch = () => {
      setReply(content.typePrompt);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        setReply(content.typePrompt);
      } else {
        setReply(content.noInput);
        speak(content.noInput);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setIsListening(false);
  };

  const askTypedQuestion = () => {
    handleMedicalQuery(typedQuestion);
  };

  return (
    <div className="voice-helper soft-surface">
      <div className="voice-helper-top">
        <div>
          <span className="eyebrow">Voice Help</span>
          <h3>{content.title}</h3>
          <p>{content.subtitle}</p>
        </div>
        <div className="voice-language-switch">
          <button
            type="button"
            className={`voice-chip ${language === "en" ? "voice-chip-active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`voice-chip ${language === "hi" ? "voice-chip-active" : ""}`}
            onClick={() => setLanguage("hi")}
          >
            Hindi
          </button>
        </div>
      </div>

      <div className="voice-helper-body">
        <button
          type="button"
          className={`voice-mic-btn ${isListening ? "voice-mic-live" : ""}`}
          onClick={startListening}
        >
          <FaMicrophoneLines />
        </button>

        <div className="voice-panels">
          <div className="voice-panel">
            <strong>You Said</strong>
            <p>{heardText || "Tap the mic and speak your symptom."}</p>
          </div>
          <div className="voice-panel">
            <strong>
              <FaVolumeHigh /> Assistant Reply
            </strong>
            <p>{reply || content.ask}</p>
          </div>
          <div className="voice-panel">
            <strong>Type And Ask</strong>
            <p>{content.typePrompt}</p>
            <div className="voice-type-row">
              <input
                type="text"
                value={typedQuestion}
                onChange={(e) => setTypedQuestion(e.target.value)}
                placeholder={content.typePlaceholder}
                className="doctor-search-input"
              />
              <div className="voice-action-row">
                <button type="button" className="btn primary-btn" onClick={askTypedQuestion}>
                  Ask
                </button>
                {isListening ? (
                  <button type="button" className="btn ghost-btn" onClick={stopListening}>
                    Stop
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMedicalAssistant;
