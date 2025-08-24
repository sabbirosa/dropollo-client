import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export interface TableQueryParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  [key: string]: any;
}

export interface UseTableQueryReturn {
  queryParams: TableQueryParams;
  updateQuery: (updates: Partial<TableQueryParams>) => void;
  resetQuery: () => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
}

interface UseTableQueryOptions {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSort?: string;
  defaultFilters?: Record<string, any>;
}

export function useTableQuery(
  options: UseTableQueryOptions = {}
): UseTableQueryReturn {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    defaultSort,
    defaultFilters = {},
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current query params
  const queryParams = useMemo(() => {
    const params: TableQueryParams = {
      page: Number(searchParams.get("page")) || defaultPage,
      limit: Number(searchParams.get("limit")) || defaultLimit,
    };

    // Add search if present
    const search = searchParams.get("search");
    if (search) {
      params.search = search;
    }

    // Add sort if present
    const sort = searchParams.get("sort") || defaultSort;
    if (sort) {
      params.sort = sort;
    }

    // Add other filters
    for (const [key, value] of searchParams.entries()) {
      if (!["page", "limit", "search", "sort"].includes(key)) {
        // Handle different data types
        if (value === "true") {
          params[key] = true;
        } else if (value === "false") {
          params[key] = false;
        } else if (!isNaN(Number(value))) {
          params[key] = Number(value);
        } else {
          params[key] = value;
        }
      }
    }

    // Apply default filters if not overridden
    Object.entries(defaultFilters).forEach(([key, value]) => {
      if (params[key] === undefined) {
        params[key] = value;
      }
    });

    return params;
  }, [searchParams, defaultPage, defaultLimit, defaultSort, defaultFilters]);

  // Update query params
  const updateQuery = useCallback(
    (updates: Partial<TableQueryParams>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset page to 1 when filters change (except when explicitly setting page)
      if (!updates.hasOwnProperty("page") && Object.keys(updates).length > 0) {
        newParams.set("page", "1");
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Reset all filters
  const resetQuery = useCallback(() => {
    setSearchParams({
      page: String(defaultPage),
      limit: String(defaultLimit),
      ...(defaultSort && { sort: defaultSort }),
      ...Object.fromEntries(
        Object.entries(defaultFilters).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    });
  }, [setSearchParams, defaultPage, defaultLimit, defaultSort, defaultFilters]);

  // Convenience methods
  const setPage = useCallback(
    (page: number) => {
      updateQuery({ page });
    },
    [updateQuery]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateQuery({ search: search || undefined });
    },
    [updateQuery]
  );

  const setSort = useCallback(
    (sort: string) => {
      updateQuery({ sort: sort || undefined });
    },
    [updateQuery]
  );

  const setFilter = useCallback(
    (key: string, value: any) => {
      updateQuery({ [key]: value });
    },
    [updateQuery]
  );

  const removeFilter = useCallback(
    (key: string) => {
      updateQuery({ [key]: undefined });
    },
    [updateQuery]
  );

  return {
    queryParams,
    updateQuery,
    resetQuery,
    setPage,
    setSearch,
    setSort,
    setFilter,
    removeFilter,
  };
}
