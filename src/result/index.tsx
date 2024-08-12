import useSWR from "swr";

const ResultComponent = (): JSX.Element => {
  const postalCodeCache = useSWR<string>(
    '@postal-code',
  );

  const responseCache = useSWR<PostalcodeResponse>(
    ["https://zipcloud.ibsnet.co.jp/api/search", postalCodeCache.data],
  );

  return (
    <section>
      <h3>検索結果</h3>

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
    </section>
  );
};

export default ResultComponent;
