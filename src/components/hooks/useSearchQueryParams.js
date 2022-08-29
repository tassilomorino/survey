import { useLocation } from "react-router-dom";
export default function useSearchQueryParams(searchString) {
    const { search } = useLocation();
    return new URLSearchParams(search).get(searchString);
}