import { useState } from "react";

function Home() {
  const [response, setResponse] = useState(null);

  const handleClick = async () => {
    const res = await fetch("http://localhost:80/health");
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <button onClick={handleClick}>Check API Health</button>
      {response && (
        <div>
          <p>Message: {response.message}</p>
          <p>Status: {response.status}</p>
        </div>
      )}
    </div>
  );
}

export default Home;