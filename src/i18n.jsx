import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
  en: {
    translation: {
      welcome: "Welcome to Agriculens",
      hello_user: "Hello, {{username}}! Ready to analyze your crops?",
      logged_in_as: "Logged in as {{username}}",
      upload_image: "Upload Image",
      upload_crop_image: "Upload Your Crop Image",
      choose_file: "Choose a file from your device or take a picture with your camera.",
      select_file: "Select from Files",
      take_picture: "Take a Picture",
      upload_results: "Upload & See Results",
      results: "Results",
      detected_disease: "Detected disease: {{disease}}",
      confidence: "Confidence: {{confidence}}",
      no_image: "No image uploaded. Go back and upload an image.",
      home: "Home",
      logout: "Logout"
    }
  },
  hi: {
    translation: {
      welcome: "अग्रिकलेन्स में आपका स्वागत है",
      hello_user: "नमस्ते, {{username}}! क्या आप अपने फ़सलों का विश्लेषण करने के लिए तैयार हैं?",
      logged_in_as: "लॉगिन किया हुआ: {{username}}",
      upload_image: "छवि अपलोड करें",
      upload_crop_image: "अपनी फ़सल की छवि अपलोड करें",
      choose_file: "अपने डिवाइस से फ़ाइल चुनें या कैमरे से तस्वीर लें।",
      select_file: "फ़ाइल से चुनें",
      take_picture: "तस्वीर लें",
      upload_results: "अपलोड करें और परिणाम देखें",
      results: "परिणाम",
      detected_disease: "पता चला रोग: {{disease}}",
      confidence: "विश्वास: {{confidence}}",
      no_image: "कोई छवि अपलोड नहीं की गई। वापस जाएँ और छवि अपलोड करें।",
      home: "होम",
      logout: "लॉगआउट"
    }
  },
  kn: {
    translation: {
      welcome: "ಅಗ್ರಿಕಲೆನ್ಸ್‌ಗೆ ಸ್ವಾಗತ",
      hello_user: "ಹಲೋ, {{username}}! ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
      logged_in_as: "ಲಾಗಿನ್ ಆಗಿದ್ದು: {{username}}",
      upload_image: "ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      upload_crop_image: "ನಿಮ್ಮ ಬೆಳೆ ಚಿತ್ರದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      choose_file: "ನಿಮ್ಮ ಸಾಧನದಿಂದ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಕ್ಯಾಮೆರಾದಿಂದ ಚಿತ್ರ ತೆಗೆದುಕೊಳ್ಳಿ.",
      select_file: "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
      take_picture: "ಚಿತ್ರ ತೆಗೆದುಕೊಳ್ಳಿ",
      upload_results: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ",
      results: "ಫಲಿತಾಂಶಗಳು",
      detected_disease: "ಹುಡುಕಿದ ರೋಗ: {{disease}}",
      confidence: "ನಂಬಿಕೆ: {{confidence}}",
      no_image: "ಯಾವುದೇ ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಆಗಿಲ್ಲ. ಹಿಂದಿರುಗಿ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      home: "ಹೋಮ್",
      logout: "ಲಾಗ್ ಔಟ್"
    }
  },
  ta: {
    translation: {
      welcome: "அக்ரிகுலென்ஸிற்கு வரவேற்கிறோம்",
      hello_user: "வணக்கம், {{username}}! உங்கள் பயிர்களை பகுப்பாய்வு செய்ய தயாரா?",
      logged_in_as: "லாகின் ஆனது: {{username}}",
      upload_image: "படத்தை பதிவேற்றவும்",
      upload_crop_image: "உங்கள் பயிர் படத்தை பதிவேற்றவும்",
      choose_file: "உங்கள் சாதனத்திலிருந்து ஒரு கோப்பைத் தேர்ந்தெடுக்கவும் அல்லது கேமராவால் படம் எடுக்கவும்.",
      select_file: "ஃபைலை தேர்ந்தெடுக்கவும்",
      take_picture: "படம் எடுக்கவும்",
      upload_results: "பதிவேற்றவும் & முடிவுகளைப் பார்க்கவும்",
      results: "முடிவுகள்",
      detected_disease: "கண்டறியப்பட்ட நோய்: {{disease}}",
      confidence: "நம்பிக்கை: {{confidence}}",
      no_image: "படம் பதிவேற்றப்படவில்லை. திரும்பிச் சென்று படம் பதிவேற்றவும்.",
      home: "ஹோம்",
      logout: "லாக் அவுட்"
    }
  },
  te: {
    translation: {
      welcome: "అగ్రికులెన్స్‌కి స్వాగతం",
      hello_user: "హలో, {{username}}! మీ పంటలను విశ్లేషించడానికి సిద్ధంగా ఉన్నారా?",
      logged_in_as: "లాగిన్ అయినది: {{username}}",
      upload_image: "చిత్రాన్ని అప్లోడ్ చేయండి",
      upload_crop_image: "మీ పంట చిత్రాన్ని అప్లోడ్ చేయండి",
      choose_file: "మీ పరికరం నుండి ఫైల్ ఎంచుకోండి లేదా కెమెరాతో ఫోటో తీయండి.",
      select_file: "ఫైల్ ఎంచుకోండి",
      take_picture: "ఫోటో తీయండి",
      upload_results: "అప్లోడ్ చేసి ఫలితాలను చూడండి",
      results: "ఫలితాలు",
      detected_disease: "కనుగొన్న వ్యాధి: {{disease}}",
      confidence: "ఆత్మవిశ్వాసం: {{confidence}}",
      no_image: "ఏ చిత్రం అప్లోడ్ చేయబడలేదు. వెనక్కి వెళ్లి చిత్రం అప్లోడ్ చేయండి.",
      home: "హోమ్",
      logout: "లాగ్ అవుట్"
    }
  },
  ml: {
    translation: {
      welcome: "അഗ്രിക്കുലെൻസിലേക്ക് സ്വാഗതം",
      hello_user: "ഹലോ, {{username}}! നിങ്ങളുടെ വിളകൾ വിശകലനം ചെയ്യാൻ തയ്യാറാണോ?",
      logged_in_as: "ലോഗിൻ ആയത്: {{username}}",
      upload_image: "ചിത്രം അപ്ലോഡ് ചെയ്യുക",
      upload_crop_image: "നിങ്ങളുടെ വിളയുടെ ചിത്രം അപ്ലോഡ് ചെയ്യുക",
      choose_file: "നിങ്ങളുടെ ഉപകരണത്തിൽ നിന്ന് ഫയൽ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ ക്യാമറ ഉപയോഗിച്ച് ചിത്രം എടുക്കുക.",
      select_file: "ഫയൽ തിരഞ്ഞെടുക്കുക",
      take_picture: "ചിത്രം എടുക്കുക",
      upload_results: "അപ്ലോഡ് ചെയ്ത് ഫലങ്ങൾ കാണുക",
      results: "ഫലങ്ങൾ",
      detected_disease: "കണ്ടെത്തിയ രോഗം: {{disease}}",
      confidence: "വിശ്വാസം: {{confidence}}",
      no_image: "ചിത്രം അപ്ലോഡ് ചെയ്തിട്ടില്ല. മടങ്ങി പോയി ചിത്രം അപ്ലോഡ് ചെയ്യുക.",
      home: "ഹോം",
      logout: "ലോഗ് ഔട്ട്"
    }
  }
},
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
