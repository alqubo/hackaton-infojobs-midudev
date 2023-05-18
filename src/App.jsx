import { useEffect, useState } from "react";

const USER_DATA_KEY = 'user_data'

function App() {
  const [userData, setUserData] = useState({name: '', description: ''});

  useEffect(() => {
    (async () => {
      const user = (await chrome.storage.sync.get(USER_DATA_KEY))[USER_DATA_KEY];
      if (user) {
        setUserData(user);
      }
    })();
  }, []);

  useEffect(() => {
    const onStorageChanged = (changes) => {
      if (changes[USER_DATA_KEY]) {
        const newUserData = changes[USER_DATA_KEY].newValue;
        setUserData(newUserData);
      }
    };

    chrome.storage.sync.onChanged.addListener(onStorageChanged);

    return () => {
      chrome.storage.sync.onChanged.removeListener(onStorageChanged);
    };
  }, []);

  const createHandleChange = (key) => (v) => {
    setUserData(prev => ({
      ...prev,
      [key]: v.target.value
    }));
  }

  const handleSaveProfile = async () => {
    await chrome.storage.sync.set({ [USER_DATA_KEY]: userData });
  }

  return (
    <main className="w-[380px] p-8 mx-auto flex flex-col justify-center items-center bg-[#f2f2f2]">
      <header className="flex flex-col items-center">
        <img className="w-32" src={"https://media.infojobs.net/portales/ij/appgrade/svgs/ij-logo-default_primary.svg"} alt={"InfoJobs logo"}/>
        <h1 className="text-[#2d3133] text-xl">Assistant</h1>
      </header>
      <section className="mt-8 w-full">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            ¿Como te llamas?
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={userData.name}
            placeholder="Alberto"
            onChange={createHandleChange('name')}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            ¿Que te define?
          </label>
          <textarea
            id="description"
            rows="8"
            value={userData.description}
            onChange={createHandleChange('description')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Programador con 5 años de experiencia en diferentes tecnologias como React, React Native, PHP, MongoDB...Centrado en desarrollo móvil ahora mismo. Mi banda salarial esta entre 40k - 50k anuales. Solo estoy interesado en trabajos remotos." />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleSaveProfile}
            className="bg-[#167db7] hover:bg-[#1d668f] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            Guardar perfil
          </button>
        </div>

      </section>
    </main>
  );
}

export default App;
