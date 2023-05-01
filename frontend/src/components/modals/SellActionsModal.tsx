import React, { useEffect, useState } from "react";
import { useAppSelector } from "redux/store";
import { useParams, useNavigate } from "react-router-dom";
import { CompleteSale } from "../completeBuySell/CompleteSale";
import { Switcher } from "../ui/Switcher";
import { Fees } from "../completeBuySell/Fees";
import { UserInfoSummary } from "./UserInfoSummary";

export const SellActionsModal = (props: {
  product: string;
  productData: [string, number, number];
  turnOffModal: () => void;
}) => {
  const productData = props.productData;
  const size = productData[0];

  const highestBid = productData[1];
  const lowestAsk = productData[2];

  console.log("SIEMA", highestBid, lowestAsk);

  const [askPrice, setAskPrice] = useState(lowestAsk);
  const [smartText, setSmartText] = useState("Please enter your ask!");
  const [switchToSellNow, setSwitchToSellNow] = useState(false);
  const [userSummary, setUserSummary] = useState("");
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  console.log(lowestAsk);

  useEffect(() => {
    if (lowestAsk !== 0) {
      if (askPrice >= lowestAsk) {
        setSmartText("You are not the lowest ask");
        setDisableButton(false);
      }
      if (askPrice < lowestAsk) {
        setSmartText("You are the lowest ask");
        setDisableButton(false);
      }
    }

    if (!switchToSellNow && askPrice === 0) {
      setSmartText("Please enter your ask");
    }

    if (lowestAsk === 0) {
      setSmartText("You are the lowest ask");
      setDisableButton(false);
    }

    if (askPrice === 0) {
      setSmartText("Minimum ask is 1$");
      setDisableButton(true);
    }
    if (highestBid === 0 && switchToSellNow) {
      setSmartText("NO BIDS AVAILABLE");
      setDisableButton(true);
    }
    if (!switchToSellNow && askPrice === highestBid) {
      setAskPrice(0);
      setSmartText("Please enter your ask!");
    }
    if (highestBid !== 0 && switchToSellNow) {
      setAskPrice(highestBid);
    }
    if (askPrice <= highestBid) {
      setDisableButton(true);
    }
    let timeout = setTimeout(() => {
      if (highestBid !== 0 && askPrice <= highestBid) {
        setSmartText("You're about to sell at the highest bid price");
        setSwitchToSellNow(true);
        setAskPrice(highestBid);
        setDisableButton(false);
      }
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [askPrice, switchToSellNow]);

  const { user, isLoggedInTemporary } = useAppSelector((state) => state.auth);
  const isLoggedInPersisted = user.isLoggedInPersisted;
  const isLoggedTemporary = isLoggedInTemporary;
  const isLoggedCondition =
    isLoggedInPersisted === "true" || isLoggedTemporary === "true";

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedInput = parseInt(e.target.value.replace(/\D/g, ""));

    const checkIfInputIsValidNumber = () => {
      if (!Number.isNaN(parsedInput)) {
        return true;
      } else {
        setAskPrice(0);
      }
    };

    if (checkIfInputIsValidNumber()) {
      setAskPrice(parsedInput);
    }
  };

  const switchHandler = () => {
    setSwitchToSellNow(!switchToSellNow);
  };

  const askHandler = () => {
    if (isLoggedCondition && switchToSellNow === false) {
      setShowSaleModal(true);
    } else if (isLoggedCondition && switchToSellNow === true) {
      setShowSaleModal(true);
    } else {
      navigate("/login");
    }
  };

  const closeCompleteSale = () => {
    setShowSaleModal(false);
  };

  const disableButtonHandler = () => {
    setDisableButton(true);
  };

  const enableButtonHandler = () => {
    if (askPrice > 0) {
      setDisableButton(false);
    }
  };

  const getUserSummary = (payout: string) => {
    setUserSummary(payout);
  };
  return (
    <>
      {!showSaleModal ? (
        <div className="text-center mr-10 text-black">
          <div className="flex bg-white rounded mb-5 px-5 py-3 justify-between">
            SIZE: {size}
            <button onClick={props.turnOffModal} className="">
              EDIT
            </button>
          </div>
          <div className="bg-white rounded">
            <Switcher
              onChange={switchHandler}
              checked={switchToSellNow && true}
              leftText={"Place Ask"}
              rightText={"Sell Now"}
            />

            <input
              type="text"
              value={askPrice}
              placeholder="Enter Ask"
              onChange={inputHandler}
              className="mt-10 outline outline-offset-2 outline-1 w-11/12 py-1 pl-1"
              disabled={switchToSellNow && true}
            />
            <p className="mt-2">{smartText}</p>

            <Fees type="selling" price={askPrice} />
          </div>
          {isLoggedCondition && (
            <UserInfoSummary
              type="selling"
              disableButton={disableButtonHandler}
              enableButton={enableButtonHandler}
              getUserSummary={(payout) => getUserSummary(payout)}
            />
          )}
          <div className="flex justify-between sm:mt-14 lg:mt-18">
            <button
              onClick={() => navigate(`/product/${id}`)}
              className="button"
            >
              Back
            </button>
            <button
              onClick={askHandler}
              disabled={disableButton}
              className="button disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {!switchToSellNow ? "Review Ask" : "Review Sale"}
            </button>
          </div>
        </div>
      ) : (
        <CompleteSale
          price={highestBid}
          askPrice={askPrice}
          userSummary={userSummary}
          productData={[props.product, size]}
          isSwitchedToSellNow={switchToSellNow}
          closeCompleteSale={closeCompleteSale}
        />
      )}
    </>
  );
};
