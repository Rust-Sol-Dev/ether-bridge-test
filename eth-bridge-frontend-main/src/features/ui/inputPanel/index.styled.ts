import { InputPanelStyleType } from "@components/config/utilities";
import styled from "styled-components";

const Container = styled.label<InputPanelStyleType>`
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  .chain_control {
    background-color: transparent;
    display: grid;
    grid-template-columns: 56px 1fr;
    border-radius: 10px;
    border: 2px solid #ffffff33;
  }

  .avatar {
    cursor: pointer;

    input[type="checkbox"] {
      appearance: none;
    }
  }

  .chain_list {
    border: 2px solid #ffffff33;
    padding: 10px 16px;
    position: absolute;
    z-index: 10;
    bottom: 0;
    background-color: #000000aa;
    transform: translateY(100%);
    flex-direction: column;
    gap: 8px;
    border-radius: 10px;
    display: none;

    h3 {
      cursor: pointer;
    }
  }

  .active {
    display: flex;
  }

  input[type="text"] {
    background-color: transparent;
    outline: none;
    border: none;
    padding: 18px 0;
    color: #ffffff88;
    font-weight: 500;
    font-size: 14px;
  }
`;

export { Container };
