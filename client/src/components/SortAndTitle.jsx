import { Title } from "../components";
import { collectionContent } from "../constant";
const SortAndTitle = ({ sortBy, setSortBy }) => {
    return (
      <div className="flex sm:flex-row flex-col justify-between mb-4">
        <Title
          text1={collectionContent.title.text1}
          text2={collectionContent.title.text2}
          withBorder
        />
        <select
          className="border-2 border-gray-200 text-sm p-3"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {collectionContent.sortingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
export default SortAndTitle  