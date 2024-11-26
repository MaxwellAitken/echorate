import React, { Suspense } from "react";
import SearchResultsPage from "./results-page";

const SearchPageWrapper = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchResultsPage />
    </Suspense>
  );
};

export default SearchPageWrapper;
