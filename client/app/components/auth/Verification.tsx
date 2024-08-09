import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: React.FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const inputRules = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const verficiationHanlder = async () => {
    console.log("test");
  };

  const handleChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return <div>Verification</div>;
};

export default Verification;
