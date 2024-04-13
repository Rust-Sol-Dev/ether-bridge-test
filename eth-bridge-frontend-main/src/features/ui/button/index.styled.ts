import { ButtonStyleType } from "@components/config/utilities";
import styled from "styled-components";

const ButtonStyle = styled.button<ButtonStyleType>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border: ${({ $border }) => $border};
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  color: ${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  justify-self: ${({ $justifySef }) => $justifySef};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: ${({ $transform }) => $transform};
  }
`;

export { ButtonStyle };
