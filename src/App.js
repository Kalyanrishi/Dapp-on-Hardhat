import { useState, useEffect } from "react";
import { ethers, JsonRpcProvider, Contract } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

import "./App.css";

function App() {
  const [greeting, doGreeting] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // remove spaces
      const url = "http://localhost:8545";
      const provider = new JsonRpcProvider(url);

      const contract = new Contract(contractAddress, Greeter.abi, provider);

      setProvider(provider);
      setContract(contract);
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getGreetings = async () => {
      const greeting = await contract.greet();
      doGreeting(greeting);
    };
    contract && getGreetings();
  }, [contract]);

  const changeGreetings = async () => {
    const input = document.querySelector("#value");
    const signer = await provider.getSigner(); // await is needed
    const signerContract = contract.connect(signer);

    const tx = await signerContract.setGreeting(input.value);
    await tx.wait(); // wait for transaction to be mined

    // Update the UI
    const newGreeting = await contract.greet();
    doGreeting(newGreeting);
  };

  return (
    <div className="center">
      <h3>{greeting}</h3>
      <input className="input" type="text" id="value" />
      <button className="button" onClick={changeGreetings}>
        Change
      </button>
    </div>
  );
}

export default App;
