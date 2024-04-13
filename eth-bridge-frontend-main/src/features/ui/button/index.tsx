import { ButtonStyleType } from "@components/config/utilities";
import * as S from "./index.styled";
import { useEffect, useState } from "react";

export function Button({
  $width,
  $height,
  $borderRadius,
  $backgroundColor,
  $color,
  $border,
  $title,
  $justifySef,
  $transform,
  $onClick,
}: ButtonStyleType) {
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if ($title?.length && $title?.length >= 15) {
      setTitle(
        $title.replace(/(0x[A-Fa-f\d]{2})[A-Fa-f\d]+([A-Fa-f\d]{4})/, "$1...$2")
      );
    } else if ($title?.length) {
      setTitle($title);
    }
  }, [$title]);

  return (
    <S.ButtonStyle
      onClick={$onClick}
      $width={$width}
      $height={$height}
      $color={$color}
      $borderRadius={$borderRadius}
      $border={$border}
      $backgroundColor={$backgroundColor}
      $justifySef={$justifySef}
      $transform={$transform}
    >
      {title}
    </S.ButtonStyle>
  );
}
