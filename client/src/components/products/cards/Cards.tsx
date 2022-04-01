import React, { useEffect, useState } from "react";
import Card from "./card/Card";
import Filter from "./filter/Filter";
import { CardsGroup, CardsContainer } from "./CardsStyles";
import Pagination from "./pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { State } from '../../../redux/reducers/index'
import { getProducts } from "../../../redux/actions/products";

export interface IData {
  length: number;
  page: (numberOfPage: number) => void
}

const Cards = (): JSX.Element => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const productsList = useSelector((state: State) => state.products)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const page = (numberOfPage: number): void => {
    setCurrentPage(numberOfPage)
    console.log(currentPage)
  }

  const finalProduct = currentPage * 32
  const firstProduct = finalProduct - 32
  const newProductList = productsList.products.slice(firstProduct, finalProduct)

  return (
    <CardsContainer className="mx-4">
      <Filter />
      <div className="mx-auto mt-3 row row-cols-1 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-2">
        {newProductList.map((e) => {
          return (
            <div className="col" key={e.id}>
              <Card name={e.name} image={e.image} price={e.price} id={e.id} />
            </div>
          );
        })}
      </div>

      <Pagination
        length={productsList.products.length}
        page={page}
      />
    </CardsContainer>
  );
};
export default Cards;
