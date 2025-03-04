import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMutualFunds, fetchCategoryFunds } from "../../features/MutualFunds/mutualFundsThunk";
import { useParams, useNavigate } from "react-router-dom";

function CategoryFunds() {
  const { category } = useParams(); // Get the category from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fundsByCategory, loading, error, categories } = useSelector((state) => state.mutualFunds);

  const categoryKey = typeof category === "string" ? category.toLowerCase() : ""; 
  const funds = Array.isArray(fundsByCategory?.[categoryKey]) ? fundsByCategory[categoryKey] : [];

  useEffect(() => {
    dispatch(fetchCategoryFunds()); // Fetch category names
  }, [dispatch]);

  useEffect(() => {
    if (category) { 
      dispatch(fetchMutualFunds({ category })); // Fetch only selected category
    }
  }, [dispatch, category]);

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center text-green-700">
        {category.replace("-", " ").toUpperCase()} Funds
      </h1>

      {/* Category Navigation Buttons */}
      <div className="flex justify-center gap-4 my-6">
        {Array.isArray(categories) && categories.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/mutual-funds/${cat.toLowerCase().replace(/\s+/g, "-")}`)}
            className={`px-4 py-2 rounded-lg text-white ${
              categoryKey === cat.toLowerCase() ? "bg-green-700" : "bg-green-500 hover:bg-green-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-600 mt-4 bg-red-100 border border-red-400 p-3 rounded-lg">
          Error: {error}
        </p>
      )}

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center animate-pulse text-green-700 text-lg mt-4">Loading...</p>
      )}

      {/* Show only funds from the selected category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {funds.length > 0 ? (
          funds.map((fund) => (
            <div
              key={fund.fund_id}
              className="p-6 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-green-700">{fund.scheme_name}</h3>
              <p className="text-gray-700 mt-1 font-medium">{fund.category} Fund</p>
              <p className="text-gray-500 text-sm">Returns: {fund.ytd_return}%</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">
            No funds available for <span className="font-semibold">{category}</span>.
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryFunds;
