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
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
