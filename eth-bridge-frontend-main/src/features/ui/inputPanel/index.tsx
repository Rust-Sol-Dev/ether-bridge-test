import { InputPanelStyleType } from "@components/config/utilities";
import * as S from "./index.styled";
import { useState } from "react";
import classNames from "classnames";

export function InputPanel({
  $label,
  $plaseHolder,
  $color,
  setCurrentChain,
  chainType,
  setAmount,
  amount,
}: InputPanelStyleType) {
  const [show, setShow] = useState<boolean>(false);

  const handleSelect = (type: boolean) => {
    setShow(false);
    setCurrentChain(type);
  };

  return (
    <S.Container $color={$color}>
      {$label}
      <div className="chain_control">
        <div className="avatar" onClick={() => setShow(!show)}>
          {/* <input type="checkbox" name="" id="" /> */}
        </div>
        <input
          type="text"
          placeholder={$plaseHolder}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          value={amount}
          disabled={chainType}
        />
        <div className={classNames("chain_list", show && !chainType && "active")}>
          <h3 onClick={() => handleSelect(chainType! ? false : true)}>
            Sepolia
          </h3>
          <h3 onClick={() => handleSelect(chainType! ? true : false)}>
            Holesky
          </h3>
        </div>
      </div>
    </S.Container>
  );
}
