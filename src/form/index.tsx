import { useState } from "react";

interface State {
  postalCode: string;
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
      console.log(state);
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
