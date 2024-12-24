import {
  ActionContext,
  Request,
  Response,
  CategoryQuery,
  CategoryQueryFormat,
  Category,
} from '@royalcyber/global-types';
import { getClientType, getCurrency, getLocale } from '../utils/Request';
import handleError from '../utils/handleError';
import { CategoryService } from '../services/CategoryService';

type ActionHook = (
  request: Request,
  actionContext: ActionContext,
) => Promise<Response>;

function getCategoryService(request: Request, actionContext: ActionContext) {
  if (!actionContext.globalContext) {
    throw new Error('Global context is undefined');
  }
  return new CategoryService(
    actionContext.globalContext,
    getLocale(request),
    getCurrency(request),
    request,
  );
}

export const getCategories: ActionHook = async (
  request: Request,
  actionContext: ActionContext,
) => {
  try {
    const clientType = getClientType(request);
    const categoryApi = getCategoryService(request, actionContext);

    const categoryQuery: CategoryQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      slug: request.query?.slug ?? undefined,
      parentId: request.query?.parentId ?? undefined,
      format: request.query?.format ?? CategoryQueryFormat.FLAT,
    };

    const queryResult = await categoryApi.queryCategories(
      categoryQuery,
      clientType,
    );

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: {
        ...categoryApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getCategoryById: ActionHook = async (
  request: Request,
  actionContext: ActionContext,
) => {
  try {
    const categoryApi = getCategoryService(request, actionContext);
    const categoryId = request.query?.id;
    if (!categoryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Category ID is required',
        }),
      };
    }

    const category = await categoryApi.getCategoryById(categoryId);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(category),
      sessionData: {
        ...categoryApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const createCategory: ActionHook = async (
  request: Request,
  actionContext: ActionContext,
) => {
  try {
    const categoryDraft = JSON.parse(request.body ?? '{}');
    const categoryApi = getCategoryService(request, actionContext);

    // Create the category
    const result = await categoryApi.create(categoryDraft);
    const clientType = getClientType(request);
    // Validate categoryId
    if (!result?.categoryId) {
      throw new Error('Category creation failed, categoryId is undefined');
    }

    // Fetch the category by ID
    const category = await categoryApi.getCategoryById(result?.categoryId);
    // Prepare response
    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(category),
      sessionData: {
        ...categoryApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateCategory: ActionHook = async (
  request: Request,
  actionContext: ActionContext,
) => {
  try {
    const categoryId = request.query?.id
      ? request.query?.id
      : JSON.parse(request.body ?? '{}').id;
    if (!categoryId) {
      throw new Error('Category ID is missing in request');
    }

    let categoryDraft: Partial<Category>;

    // Validate and parse JSON
    try {
      categoryDraft = JSON.parse(request.body ?? '{}');
    } catch (error) {
      throw new Error('Invalid JSON in request body');
    }

    if (!actionContext.globalContext) {
      throw new Error('Global context is undefined');
    }

    const categoryApi = new CategoryService(
      actionContext.globalContext,
      getLocale(request),
      getCurrency(request),
    );

    const updatedCategory = await categoryApi.updateCategory(
      categoryId,
      categoryDraft,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updatedCategory),
      sessionData: {
        ...categoryApi.getSessionData(),
      },
    } as Response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const deleteCategory: ActionHook = async (
  request: Request,
  actionContext: ActionContext,
) => {
  try {
    const clientType = getClientType(request);
    const categoryApi = getCategoryService(request, actionContext);
    const categoryId = request.query?.id;
    if (!categoryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Category ID is required',
        }),
      };
    }
    const categoryData = await categoryApi.getCategoryById(categoryId);
    let categoryVersion = categoryData.version;
    if (!categoryVersion) {
      throw new Error('Category version is undefined');
    }
    const category = await categoryApi.deleteCategory(
      categoryId,
      categoryVersion,
      clientType,
    );
    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(category),
      sessionData: {
        ...categoryApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
