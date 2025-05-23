import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import Message from './Message';
import './Chatbot.css';


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setReading] = useState(false);
  let speechMsgRef = useRef(null);
  const chatWindowRef = useRef();
  const [isSending, setIsSending] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleUserMessage = async (userMessage) => {
    setIsLoading(true);
    setMessages((prevMessages) => {//console.log(prevMessages)
      return[...prevMessages, { text: userMessage, role: 'user' }]});
    setInput('');

    try {
      const formData = new FormData();
      formData.append('language', 'English');
      formData.append('question', userMessage);
      // formData.append('name', 'answer_prev');

      const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
        Accept: 'application/json'
      };

      const response = await axios.post('http://115.124.98.61/agroemandi/home/chat_boat_v1', formData, requestOptions);

      const botMessage = { text: response.data.answer, role: 'bot' };

      const modifiedBotMessage = { ...botMessage, text: botMessage.text };
      // console.log(modifiedBotMessage)
      setMessages((prevMessages) => {//console.log(prevMessages)
      return [...prevMessages, modifiedBotMessage]} );
      
    } catch (error) {
      console.error('Error sending message to API:', error);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim() === '') return;

    setIsSending(true); 

    try {
      await handleUserMessage(input); 
      setInput('');
    } catch (error) {
      console.error('Error sending user message:', error);
    } finally {
      setIsSending(false); 
    }
  };

  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages]);

  const lang = 'hi-IN'
  const voiceIndex = 1

  // const readMessage = async (text) => {
  //   if ('speechSynthesis' in window) {
  //     const speechSynthesis = window.speechSynthesis;

  //     if (isReading) {
  //       if (speechMsgRef.current) {
  //         speechSynthesis.cancel();
  //       }
  //       setReading(false);
  //     } else {
  //       const speechMsg = new SpeechSynthesisUtterance(text);
  //       speechMsg.voice = await chooseVoice()
  //       speechMsg.lang = 'hi-IN'
  //       // speechSynthesis.speak(utterance)
  //       // console.log(speechMsg)

  //       speechMsg.onend = () => {
  //         setReading(false);
  //       };

  //       speechMsgRef.current = speechMsg;
  //       speechSynthesis.speak(speechMsg);
  //       setReading(true);
  //     }
  //     setReading(!isReading);
  //   } else {
  //     console.log('Text-to-speech is not supported in this browser.');
  //   }
  // };
  
 
  const readMessage = async (text) => {
    if ('speechSynthesis' in window) {
      const speechSynthesis = window.speechSynthesis;

      if (isReading) {
        if (speechMsgRef.current) {
          speechSynthesis.cancel();
        }
      } else {
        const speechMsg = new SpeechSynthesisUtterance(text);
        speechMsg.voice = await chooseVoice();
        speechMsg.lang = 'hi-IN';

        speechMsg.onend = () => {
          setReading(false);
        };


        speechMsgRef.current = speechMsg;
        speechSynthesis.speak(speechMsg);
      }

      setReading(!isReading);
    } else {
      console.log('Text-to-speech is not supported in this browser.');
    }
  };

  const getVoices = () => {
    return new Promise(resolve => {
      let voices = speechSynthesis.getVoices()
      if (voices.length) {
        resolve(voices)
        return
      }
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices()
        resolve(voices)
      }
    })
  }

  const chooseVoice = async () => {
    const voices = (await getVoices()).filter(voice => voice.lang === lang)

    return new Promise(resolve => {
      resolve(voices[voiceIndex])
    })
  }

  // const translateMessage = async (text, targetLang) => {
  //   try {
  //     setIsLoading(true);
  //     const detectResponse = await axios.get(
  //       `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=t&q=${encodeURIComponent(
  //         text
  //       )}`
  //     );

  //     const detectedSourceLang = detectResponse.data[2];
  //     // console.log(detectedSourceLang)

  //     // const lines = text.split('.');
  //     const lines = text.split('\n\n').filter((sentence) => sentence.trim() !== '');
  //     const translatedLines = [];

  //     for (const line of lines) {
  //       const response = await axios.get(
  //         `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedSourceLang}&tl=${targetLang}&dt=t&dt=t&q=${encodeURIComponent(
  //           line
  //         )}`
  //       );

  //       if (
  //         response &&
  //         response.data &&
  //         Array.isArray(response.data) &&
  //         response.data[0] &&
  //         response.data[0][0]
  //       ) {
  //         const translatedText = response.data[0][0][0];
  //         translatedLines.push(translatedText);
  //       } else {
  //         translatedLines.push(line);
  //       }
  //     }
  //     // console.log(translatedLines)
  //     setIsLoading(false);
  //     const translatedText = translatedLines.join('\n\n');
  //     return translatedText
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error('Error translating text:', error);
  //     return null;
  //   }
  // };

  const translateMessage = async (text, targetLang) => {
    try {
      setIsLoading(true);
      const detectResponse = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
  
      const detectedSourceLang = detectResponse.data[2];
      const lines = text.split('.'); 
      const translatedLines = [];
  
      for (const line of lines) {
        const segments = line.split('\n\n'); // Split each line by double newlines
        const translatedSegments = [];
  
        for (const segment of segments) {
          const response = await axios.get(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedSourceLang}&tl=${targetLang}&dt=t&dt=t&q=${encodeURIComponent(
              segment
            )}`
          );
  
          if (
            response &&
            response.data &&
            Array.isArray(response.data) &&
            response.data[0] &&
            response.data[0][0]
          ) {
            const translatedText = response.data[0][0][0];
            translatedSegments.push(translatedText);
          } else {
            translatedSegments.push(segment);
          }
        }
  
        const translatedLine = translatedSegments.join('\n\n'); 
        translatedLines.push(translatedLine);
      }
  
      setIsLoading(false);
      const translatedText = translatedLines.join('.'); 
      return translatedText;
    } catch (error) {
      setIsLoading(false);
      console.error('Error translating text:', error);
      return null;
    }
  };
  

  const handleMicClick = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        console.log('Microphone is active');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        console.log('Microphone is inactive');
      };

      recognition.start();
    } else {
      console.log('Speech recognition is not supported in this browser.');
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (input.trim() === '') return;

  //   setIsSending(true);

  //   try {
  //     await handleUserMessage(input);

  //     if (messages.length > 0) {
  //       const lastMessage = messages[messages.length - 1];

  //       if (lastMessage.role === 'bot') {
  //         let translatedText;

  //         if (lastMessage.text.includes('\n')) {
  //           translatedText = await translateMessage(lastMessage.text, selectedLanguage);
  //         } else {
  //           translatedText = await translateMessage(lastMessage.text, selectedLanguage);
  //         }

  //         if (translatedText) {
  //           const translatedMessage = { text: translatedText, role: 'bot' };
  //           setMessages((prevMessages) => [...prevMessages, translatedMessage]);
  //         }
  //       }
  //     }

  //     setInput('');
  //   } catch (error) {
  //     console.error('Error sending user message:', error);
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  // const handleTranslateClick = async (text, targetLanguage) => {
  //   try {
  //     setIsLoading(true);
  //     const translatedText = await translateMessage(text, targetLanguage);

  //     if (translatedText) {
  //       const translatedMessage = { text: translatedText, role: 'bot' };
  //       setMessages((prevMessages) => [...prevMessages, translatedMessage]);
  //     }
  //   } catch (error) {
  //     console.error('Error translating message:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleTranslateClick = async (text, targetLanguage) => {
    try {
      setIsLoading(true);
      const translatedText = await translateMessage(text, targetLanguage);
  
      if (translatedText) {
        const translatedMessage = { text: translatedText, role: 'bot', selectedLanguage: targetLanguage };
        setMessages((prevMessages) => [...prevMessages, translatedMessage]);
      }
    } catch (error) {
      console.error('Error translating message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLanguageChange = (lang, index) => {
    const newMessages = [...messages];
    newMessages[index].selectedLanguage = lang;
    setMessages(newMessages);
  };

  return (
    <>
      <div className="background-image">
        <img src={require('./bot.gif')} alt="Computer man" className='chat-bot'></img>
      </div>

      <div className="chatbot-container">
        {isLoading && (
          <div className="loader-container">
            <div className="loader" />
          </div>
        )}
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message, index) =>  {
            // console.log(message)
           return <Message
              key={index}
              message={message}
              onSpeakerClick={() => readMessage(message.text)}
              // selectedLanguage={selectedLanguage}
              // setSelectedLanguage={setSelectedLanguage}
              // onTranslateClick={() => {
              //   if (message.role === 'bot') {
              //     translateMessage(message.text, selectedLanguage).then((translatedText) => {
              //       if (translatedText) {
              //         const translatedMessage = { text: translatedText, role: 'bot' };
              //         setMessages((prevMessages) => [...prevMessages, translatedMessage]);
              //       }
              //     });
              //   }
              // }}
              selectedLanguage={message.selectedLanguage || selectedLanguage}
              setSelectedLanguage={(lang) => handleLanguageChange(lang, index)}
              onTranslateClick={(targetLanguage) => handleTranslateClick(message.text, targetLanguage)}
              
            />
})}

        </div>
        <form className="chat-input" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <Icon icon="bi:mic-fill"
              className="mic-icon"
              width="22"
              height="22"
              onClick={handleMicClick} />
          </div>
          {/* <button type="submit">
            <Icon icon="fluent:send-20-filled"
              color="white"
              width="20"
              height="20" />
          </button> */}

          <button type="submit" disabled={isSending}>
            {isSending ? (
              <div className="loader" />
            ) : (
              <Icon icon="fluent:send-20-filled" color="white" width="20" height="20" />
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
