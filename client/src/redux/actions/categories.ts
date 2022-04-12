import axios from "axios";
import { Dispatch } from "redux";
import { FORM_SUB } from "../../components/products/categories/create/CreateCategories";

import { Category, TYPES_CATEGORIES } from "../interface";

const URL = "http://localhost:3001/api";

export function getCategories() {
  return async function (dispatch: Dispatch) {
    const categories = await axios.get(URL + "/categories");

    return dispatch({
      type: TYPES_CATEGORIES.GET_CATEGORIES,
      payload: categories.data.data,
    });
  };
}
export function getSubcategories() {
  return async function (dispatch: Dispatch) {
    const subcategories = await axios.get(URL + "/subcategories");

    return dispatch({
      type: TYPES_CATEGORIES.GET_SUBCATEGORIES,
      payload: subcategories.data.data,
    });
  };
}

export function createCategories(category: Category) {
  return async function (dispatch: Dispatch) {
    await axios.post(URL + "/categories", category)
  }
}

export function createSubcategories(subcategory: FORM_SUB) {
  return async function (dispatch: Dispatch) {
    console.log(subcategory)
    await axios.post(URL + "/subcategories", subcategory)
  }
}

export const resetSubcategories = () => {
  try {
    return ({
      type: TYPES_CATEGORIES.RESET_SUBCATEGORIES,
      payload: []
    });
  } catch (error) {
    alert(error);
  }
};

export const deleteCategory = (id: string) => {
  try {
    return async function (dispatch: Dispatch) {
      await axios.delete(URL + `/categories/${id}`)
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteSubcategory = (id: string) => {
  try {
    return async function (dispatch: Dispatch) {
      await axios.delete(URL + `/subcategories/${id}`)
    }
  } catch (error) {
    console.log(error)
  }
}