import { useState } from "react";
import useSWR from "swr";

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
  console.log(data);
  return data;
}

const FormComponent = (): JSX.Element => {
  const [state, setState] = useState<State>({
    postalCode: "",
  });

  const postalCodeCache = useSWR<string>(
    '@postal-code',
    null,
  );

  const responseCache = useSWR<PostalcodeResponse>(
    ["https://zipcloud.ibsnet.co.jp/api/search", postalCodeCache.data],
    fetcher,
    {
      /**
       * SWRはデフォルトでフォーカス時・再接続時・マウント時に再検証を行い、fetcherを呼び出す
       * 今回はフォームの入力値が変更された時のみ再検証を行えば良いので、以下のように設定する
       */
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    }
  );

  const handlers = {
    input: (e: React.ChangeEvent<HTMLInputElement>) => {
      setState({
        ...state,
        postalCode: e.target.value,
      });
    },
    submit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      postalCodeCache.mutate(state.postalCode);
    },
  };

  return (
    <form
      onSubmit={handlers.submit}
    >
      {/* 入力 */}
      <label>
        郵便番号
      </label>
      <input
        type="text"
        value={state.postalCode}
        onChange={handlers.input}
      />

      {/* 検索 */}
      <button type="submit">
        住所検索
      </button>

      {/* ローディング */}
      {responseCache.isValidating && <p>検索中...</p>}

      {/* response */}
      {responseCache?.data?.results?.map((result, index) => (
        <div key={index}>
          <span>
            {result.address1}
            {result.address2}
            {result.address3}
          </span>
        </div>
      ))}
    </form>
  );
};

export default FormComponent;
