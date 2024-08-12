import { useState } from "react";
import useSWR from "swr";

interface State {
  postalCode: string;
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
      className="space-y-4 p-4 bg-white rounded shadow-md"
    >
      {/* 入力 */}
      <label className="block text-sm font-medium text-gray-700">
        郵便番号
      </label>
      <input
        type="text"
        value={state.postalCode}
        onChange={handlers.input}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />

      {/* 検索 */}
      <button
        type="submit"
        disabled={responseCache.isValidating}
        className={`mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
          responseCache.isValidating
            ? "bg-gray-400"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }`}
      >
        住所検索
      </button>
    </form>
  );
};

export default FormComponent;
