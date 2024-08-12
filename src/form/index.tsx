import { useState } from "react";
import useSWR from "swr";
import { fetcher, validatePostalCode } from "./utils";

interface State {
  postalCode: string;
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
      const confirmMessage = `
        以下の内容で検索を実行します
        郵便番号: ${state.postalCode}
      `;
      if (confirm(confirmMessage)) {
        postalCodeCache.mutate(state.postalCode);
      }
    },
  };

  const isCodeInvalid : boolean = (
    !validatePostalCode(state.postalCode) && state.postalCode.length > 0
  );
  const isButtonDisabled: boolean = (
    !validatePostalCode(state.postalCode) || responseCache.isValidating
  );

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
        className={`
          mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
          isCodeInvalid ?
          'border-red-500 focus:ring-red-500 focus:border-red-500' :
          'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
        }`}
      />

      {/* 警告 */}
      {isCodeInvalid && (
        <p className="text-red-500 text-xs">7桁の数字を入力してください</p>
      )}

      {/* 検索 */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
          isButtonDisabled
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
