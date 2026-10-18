import { useState } from "react";

const ops = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? NaN : a / b),
};

const format = (n) =>
  Number.isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d) => {
    if (display === "Error" || waiting) {
      setDisplay(d);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (display === "Error" || waiting) {
      setDisplay("0.");
      setWaiting(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOperator(null);
    setWaiting(false);
  };

  const toggleSign = () => {
    if (display !== "0" && display !== "Error") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  };

  const percent = () => {
    if (display !== "Error") setDisplay(format(parseFloat(display) / 100));
  };

  const chooseOperator = (next) => {
    if (display === "Error") return;
    const current = parseFloat(display);
    if (prev !== null && operator && !waiting) {
      const result = ops[operator](prev, current);
      setDisplay(format(result));
      setPrev(Number.isFinite(result) ? result : null);
    } else {
      setPrev(current);
    }
    setOperator(next);
    setWaiting(true);
  };

  const equals = () => {
    if (prev === null || !operator || display === "Error") return;
    const result = ops[operator](prev, parseFloat(display));
    setDisplay(format(result));
    setPrev(null);
    setOperator(null);
    setWaiting(true);
  };

  const buttons = [
    { label: "AC", onClick: clear, type: "fn" },
    { label: "±", onClick: toggleSign, type: "fn" },
    { label: "%", onClick: percent, type: "fn" },
    { label: "÷", onClick: () => chooseOperator("÷"), type: "op" },
    ...["7", "8", "9"].map((d) => ({ label: d, onClick: () => inputDigit(d) })),
    { label: "×", onClick: () => chooseOperator("×"), type: "op" },
    ...["4", "5", "6"].map((d) => ({ label: d, onClick: () => inputDigit(d) })),
    { label: "−", onClick: () => chooseOperator("−"), type: "op" },
    ...["1", "2", "3"].map((d) => ({ label: d, onClick: () => inputDigit(d) })),
    { label: "+", onClick: () => chooseOperator("+"), type: "op" },
    { label: "0", onClick: () => inputDigit("0"), wide: true },
    { label: ".", onClick: inputDot },
    { label: "=", onClick: equals, type: "op" },
  ];

  const colors = {
    fn: { background: "#a5a5a5", color: "#000" },
    op: { background: "#ff9f0a", color: "#fff" },
    num: { background: "#333", color: "#fff" },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.calc}>
        <div style={styles.display}>{display}</div>
        <div style={styles.grid}>
          {buttons.map((b) => {
            const active = b.type === "op" && operator === b.label && waiting;
            return (
              <button
                key={b.label}
                onClick={b.onClick}
                style={{
                  ...styles.button,
                  ...colors[b.type || "num"],
                  ...(b.wide ? styles.wide : {}),
                  ...(active ? { background: "#fff", color: "#ff9f0a" } : {}),
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1c1c1e",
    fontFamily: "system-ui, sans-serif",
  },
  calc: {
    width: 320,
    padding: 20,
    borderRadius: 24,
    background: "#000",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  display: {
    color: "#fff",
    fontSize: 56,
    textAlign: "right",
    padding: "20px 10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  button: {
    height: 64,
    border: "none",
    borderRadius: 32,
    fontSize: 26,
    cursor: "pointer",
  },
  wide: {
    gridColumn: "span 2",
    textAlign: "left",
    paddingLeft: 26,
  },
};
