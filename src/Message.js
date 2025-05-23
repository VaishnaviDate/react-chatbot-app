
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Chatbot.css';

const Message = ({ message, onSpeakerClick, onTranslateClick, selectedLanguage, setSelectedLanguage }) => {
  const { text, role } = message;

  // const handleSpeakerClick = () => {
  //   onSpeakerClick(text);
  // };

  const [isReading, setIsReading] = useState(false);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);


  const handleSpeakerClick = () => {
    if (!isReading) {
      setIsReading(true);
      onSpeakerClick(text);

    } else {
      setIsReading(false);
    }
  };

  function replaceWithBr(text) {
    return text.replace(/\n/g, "<br />")
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'Marathi' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ja', name: 'Japanese' },
    { code: 'te', name: 'Telugu' },
    { code: 'fr', name: 'French' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarathi' },
    { code: 'or', name: 'Odia (Oriya)' },
    { code: 'as', name: 'Assamese' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bho', name: 'Bhojpuri' },
    { code: 'gom', name: 'Konkani' },
  
  ];

  // const handleLanguageChange = (event) => {
  //   setSelectedLanguage(event.currentTarget.value);
  //   setIsDropdownClicked(true);
  // };

  const handleDropdownClick = () => {
    setIsDropdownClicked(!isDropdownClicked);
  };

  return (
    <div className={`message-container ${role === 'user' ? 'user' : 'bot'}`}>
      <div className={`message ${role === 'user' ? 'user-message' : 'bot-message'}`}>
      {role === 'bot' ? (
          <Icon
            icon={isReading ? "zondicons:pause-outline" : "fluent:speaker-2-16-regular"}
            width="20"
            height="20"
            style={{ paddingTop: '4px', cursor: 'pointer' ,float:"right"}}
            onClick={handleSpeakerClick}
          />):null}


        <p style={{marginTop: "25px"}} dangerouslySetInnerHTML={{__html: replaceWithBr(text)}} />

        <span style={{ float: 'right', display: "flex" }}>

          {role === 'bot' ? (
            <>
              <div className={`translate-dropdown ${isDropdownClicked ? 'clicked' : ''}`} onClick={handleDropdownClick}>
                <select value={selectedLanguage} 
                // onChange={handleLanguageChange} 
                onChange={(event) => setSelectedLanguage(event.target.value)}>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <Icon icon="bi:translate"
                  onClick={() => onTranslateClick(selectedLanguage)}
                  className="translate-icon">
                </Icon>
              </div>
            </>
          ) : null}

        </span>
      </div>
    </div>
  );
};

export default Message;
