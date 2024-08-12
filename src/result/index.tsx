import useSWR from "swr";

const ResultComponent = (): JSX.Element => {
  const postalCodeCache = useSWR<string>(
    '@postal-code',
  );

  const responseCache = useSWR<PostalcodeResponse>(
    ["https://zipcloud.ibsnet.co.jp/api/search", postalCodeCache.data],
  );

  return (
    <section className="mt-8 p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-medium text-gray-900">検索結果</h3>

      {/* ローディング */}
      {responseCache.isValidating && (
        <p className="mt-2 text-sm text-gray-500">検索中...</p>
      )}

      {/* エラー */}
      {responseCache.error && (
        <p className="mt-2 text-sm text-gray-500">エラーが発生しました</p>
      )}

      {/* データが空 */}
      {responseCache.data?.results == null && (
        <p className="mt-2 text-sm text-gray-500">該当する住所が見つかりませんでした</p>
      )}

      {/* 正常終了 */}
      {responseCache?.data?.results?.map((result, index) => (
        <div key={index} className="mt-4 p-2 border-b border-gray-200">
          <span className="block text-sm text-gray-700">
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
