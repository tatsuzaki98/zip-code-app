import { useState } from "react";

interface State {
  postalCode: string;
}

interface PostalcodeResponse {
  message: string | null;
  results: {
    address1: string;
    address2: string;
    address3: string;
    kana1: string;
    kana2: string;
    kana3: string;
    prefcode: string;
    zipcode: string;
  }[] | null;
  status: number;
}

const fetcher = async ([url, postalCode]: [string, string]): Promise<PostalcodeResponse> => {
  const response = await fetch(`${url}?zipcode=${postalCode}`);
  const data = await response.json();
  return data;
}

const FormComponent = (): JSX.Element => {
  const [state, setState] = useState<State>({
    postalCode: "",
  });

  const handlers = {
    input: (e: React.ChangeEvent<HTMLInputElement>) => {
      setState({
        ...state,
        postalCode: e.target.value,
      });
    },
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      fetcher([
        "https://zipcloud.ibsnet.co.jp/api/search",
        state.postalCode,
      ])
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  };

  return (
    <form
      onSubmit={handlers.submit}
    >
      <label>
        郵便番号
      </label>
      <input
        type="text"
        value={state.postalCode}
        onChange={handlers.input}
      />
      <button type="submit">
        住所検索
      </button>
    </form>
  );
};

export default FormComponent;
