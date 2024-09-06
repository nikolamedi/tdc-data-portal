import classNames from "@utils/classnames";
import { useState } from "react";

export default function SimpleSearchInput({
  onTextInput,
  placeholder,
}: {
  onTextInput: (text: string) => void;
  placeholder?: string;
}) {
  const [searchText, setSearchText] = useState("");
  return (
    <div className={classNames("relative rounded-md shadow-sm")}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.9046 9.39129L9.6597 9.73573L9.95854 10.0346L13.8084 13.8844C13.8615 13.9407 13.8909 14.0154 13.8903 14.093C13.8896 14.1717 13.858 14.2469 13.8024 14.3025L14.156 14.6561L13.8024 14.3025C13.7468 14.3581 13.6715 14.3897 13.5929 14.3904C13.5153 14.3911 13.4406 14.3617 13.3842 14.3085L9.53525 10.4595L9.23639 10.1606L8.89195 10.4055C8.24864 10.863 7.49183 11.1345 6.70445 11.1904C5.91707 11.2462 5.1295 11.0843 4.42805 10.7223C3.72659 10.3603 3.13832 9.81216 2.7277 9.138L2.30068 9.3981L2.7277 9.138C2.31708 8.46385 2.09994 7.68968 2.1001 6.90032L2.1001 6.90016C2.10001 6.22341 2.25966 5.5562 2.56605 4.95279C2.87245 4.34938 3.31694 3.8268 3.86338 3.42757C4.40982 3.02833 5.04278 2.76371 5.71077 2.65522C6.37876 2.54673 7.06293 2.59744 7.70763 2.80323C8.35233 3.00901 8.93936 3.36405 9.42097 3.83949C9.90258 4.31492 10.2652 4.89731 10.4793 5.5393C10.6933 6.18129 10.7529 6.86475 10.653 7.53409C10.5532 8.20343 10.2967 8.83974 9.9046 9.39129ZM6.4001 3.20022C5.4188 3.20022 4.47769 3.59004 3.7838 4.28393C3.08992 4.97781 2.7001 5.91892 2.7001 6.90022C2.7001 7.88152 3.08992 8.82263 3.7838 9.51652C4.47769 10.2104 5.4188 10.6002 6.4001 10.6002C7.3814 10.6002 8.32251 10.2104 9.01639 9.51652C9.71028 8.82263 10.1001 7.88152 10.1001 6.90022C10.1001 5.91892 9.71028 4.97781 9.01639 4.28393C8.32251 3.59004 7.3814 3.20022 6.4001 3.20022Z"
            fill="#6B7280"
            stroke="#6B7280"
          />
        </svg>
      </div>
      <input
        value={searchText}
        onChange={(x) => {
          setSearchText(x.target.value);
          onTextInput(x.target.value);
        }}
        type="text"
        name="search"
        placeholder={placeholder ?? ""}
        id="search"
        className="block w-full rounded-md border-0 py-1.5 pl-9 pr-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#111928] sm:text-sm sm:leading-6"
      />
      {searchText && (
        <div
          onClick={() => {
            setSearchText("");
            onTextInput("");
          }}
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
        >
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00026 6.35866L5.64671 6.0051L3.07096 3.42936C3.07094 3.42934 3.07093 3.42932 3.07091 3.4293C3.05216 3.41059 3.02675 3.40008 3.00026 3.40008C2.97377 3.40008 2.94836 3.41059 2.92962 3.4293C2.9296 3.42932 2.92958 3.42934 2.92956 3.42936M6.00026 6.35866L2.57606 3.92415C2.46358 3.81163 2.40039 3.65905 2.40039 3.49995C2.40039 3.34085 2.46358 3.18827 2.57606 3.07575L2.92956 3.42936M6.00026 6.35866L6.35382 6.0051L8.92962 3.4293L8.92967 3.42936L8.93571 3.42311C8.94493 3.41356 8.95597 3.40594 8.96817 3.4007L8.77082 2.94129L8.96817 3.4007C8.98037 3.39546 8.99349 3.3927 9.00677 3.39258C9.02004 3.39247 9.03321 3.395 9.0455 3.40002C9.05779 3.40505 9.06896 3.41248 9.07835 3.42187C9.08773 3.43126 9.09516 3.44242 9.10019 3.45471C9.10522 3.467 9.10775 3.48017 9.10763 3.49345C9.10752 3.50672 9.10476 3.51985 9.09952 3.53205C9.09428 3.54425 9.08666 3.55528 9.07711 3.56451L9.07705 3.56445L9.07091 3.5706L6.49511 6.1464L6.14156 6.49995L6.49511 6.8535L9.06655 9.42494C9.08367 9.44359 9.09311 9.46807 9.09289 9.49345C9.09266 9.51967 9.08214 9.54475 9.0636 9.56329C9.04506 9.58183 9.01998 9.59235 8.99376 9.59257C8.96838 9.59279 8.9439 9.58336 8.92525 9.56624L6.35382 6.9948L6.00026 6.64124L5.64671 6.9948L3.07527 9.56623C3.05663 9.58336 3.03215 9.59279 3.00677 9.59257C2.98055 9.59235 2.95547 9.58183 2.93692 9.56329C2.91838 9.54475 2.90787 9.51967 2.90764 9.49345C2.90742 9.46807 2.91685 9.44359 2.93398 9.42494L5.50542 6.8535L5.85897 6.49995L5.50542 6.1464L2.92967 3.57065L2.57614 3.92408L2.92962 3.5706M6.00026 6.35866L2.92962 3.5706M2.92956 3.42936C2.91088 3.4481 2.90039 3.47349 2.90039 3.49995C2.90039 3.52644 2.9109 3.55185 2.92962 3.5706M2.92956 3.42936L2.92962 3.5706"
              fill="#111928"
              stroke="#6B7280"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
