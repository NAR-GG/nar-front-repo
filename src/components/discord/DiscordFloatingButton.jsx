import { useState } from "react";
import { ActionIcon, Text } from "@mantine/core";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

export function DiscordFloatingButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          css={css({
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            bottom: 24,
            right: 104,
            background: "rgb(88, 101, 242)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.3s, transform 0.3s",
            pointerEvents: "auto",
            zIndex: 10000,

            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "5%",
              right: "-20px",
              transform: "translateY(-50%)",
              borderWidth: "12px",
              borderStyle: "solid",
              borderColor:
                "transparent transparent transparent rgb(88, 101, 242)",
            },
          })}
        >
          <Text fz={12} fw={600}>
            NAR.GG에 오신 것을 환영합니다!
          </Text>
          <Text fz={12} fw={600} style={{ marginTop: "18px" }}>
            문의 방법
          </Text>
          <Text fz={12} fw={600} c="#DEE2E6">
            모든 문의는 디스코드의 ‘문의사항’ 채널에
            <br /> 포스트를 등록해 주시면 됩니다.
          </Text>
        </div>
      )}

      <ActionIcon
        size={60}
        radius="xl"
        variant="filled"
        component="a"
        href="https://discord.gg/VRFD73Hnza"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        css={css({
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          padding: 0,
          background: "#5865F2",
          transition: "transform 0.18s ease-out, box-shadow 0.18s ease-out",
          "&:hover": {
            transform: "scale(1.08)",
            border: "none",
          },
          "&:active": {
            transform: "scale(0.96)",
          },
        })}
      >
        <img
          src="/icons/discord.svg"
          alt="디스코드"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </ActionIcon>
    </>
  );
}
