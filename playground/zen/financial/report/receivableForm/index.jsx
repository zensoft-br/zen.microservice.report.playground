import { useMemo } from "react";
import * as utils from "./utils.jsx";

export default async function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const settings =
    utils.deepMerge(report?.properties?.["#settings"], report?.properties?.userSettings) ?? {};

  const ctx = useMemo(() => ({ t, utils }), [t, utils]);

  data.forEach((entity) => {
    const dueDate = toUTCDate(entity.dueDate);
    const dueDateAdjusted = adjustWeekend(dueDate);
    const now = toUTCDate(new Date());

    entity.totalValue = entity.balance;

    if (dueDateAdjusted < now) {
      // const days = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

      entity.fine = Math.round(entity.balance * (entity.wallet?.lateFee ?? 0)) / 100;
      entity.interest = calculateInterest(entity);
      entity.totalValue = Math.round((entity.balance + entity.fine + entity.interest) * 100) / 100;

      // entity.dueDate = now.toISOString().substring(0, 10);

      if (entity.properties?.bankslip?.barcode) {
        entity.properties.bankslip.barcode = generateBarcode(
          entity.properties.bankslip.barcode,
          now,
          entity.totalValue,
        );
        entity.properties.bankslip.barcodeFormatted = barcodeToBarcodeFormatted(
          entity.properties.bankslip.barcode,
        );
      }
    }

    if (dueDate < now) {
      entity.dueDate = now.toISOString().substring(0, 10);
    }
  });

  const Band = ({ children, className, ...props }) => {
    return (
      <div className={`flex ${className ?? ""} ${props.v ? "v" : "h"}`} {...props}>
        {children}
      </div>
    );
  };

  const BankslipSection = ({ data, ctx }) => {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) 0.6fr 5fr" }}>
          <Slot className="center middle">
            {data.wallet?.properties?.bank && (
              <img
                className="logo"
                src={`https://zenerp.s3.amazonaws.com/public/financial/bank.BR.${data.wallet?.properties?.bank}.png`}
                alt="bank"
              />
            )}
          </Slot>
          <Slot className="center middle" style={{ fontSize: "1.1rem" }}>
            {data.wallet?.properties?.bank && (
              <>
                {`${String(data.wallet?.properties?.bank).padStart(3, "0")}-${checkDigit11(
                  String(data.wallet?.properties?.bank),
                )}`}
              </>
            )}
          </Slot>
          <Slot className="center middle" style={{ fontSize: "1.1rem" }}>
            {data.properties?.bankslip?.barcodeFormatted}
          </Slot>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr" }}>
          <Slot description="Local de pagamento">
            Pagável em qualquer instituição financeira ou nos canais de atendimento.
          </Slot>
          <Slot description="Vencimento" className="right">
            {utils.formatDate(data.dueDate)}
          </Slot>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr" }}>
          <Slot description="Beneficiário">{formatPerson(data.company.person, ctx)}</Slot>
          <Slot description="Agência/Código do beneficiário" className="right">
            {`${String(data.wallet?.properties?.bankBranch).padStart(4, "0")}/${
              data.wallet?.properties.bankAccount
            }-${data.wallet?.properties.bankAccountChecksum}`}
          </Slot>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 2fr" }}>
          <Slot description="Data do doc.">{utils.formatDate(data.issueDate)}</Slot>
          <Slot description="Nº do doc.">{data.code}</Slot>
          <Slot description="Espécie doc.">DM</Slot>
          <Slot description="Aceite">N</Slot>
          <Slot description="Data proces.">{utils.formatDate(new Date())}</Slot>
          <Slot description="Nosso número" className="right">
            {data.properties?.bankslip?.bankNumberFormatted ??
              data.properties?.bankslip?.bankNumber}
          </Slot>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 2fr" }}>
          <Slot description="Uso do banco"></Slot>
          <Slot description="Carteira">{data.wallet?.properties?.bankWallet}</Slot>
          <Slot description="Moeda">R$</Slot>
          <Slot description="Quantidade"></Slot>
          <Slot description="Valor"></Slot>
          <Slot description="(=) Valor do documento" className="right">
            {utils.formatNumber(data.value, { digits: 2 })}
          </Slot>
        </div>
      </>
    );
  };

  const Slot = ({ description, number, className, children, ...props }) => {
    return (
      <div className={`z-slot ${number ? "number" : ""} ${className ?? ""}`} {...props}>
        {description && <label>{description}</label>}
        {children}
      </div>
    );
  };

  return (
    <div className="report-wrapper" style={{ fontSize: settings?.fontSize }}>
      {data.map((data) => (
        <div className={`report-container ${settings?.pageSize ?? "a4"} ${settings?.orientation}`}>
          {/* Logo */}
          {data.company.image?.url && (
            <Band v>
              <img className="logo" src={data.company.image.url} alt="logo" />
            </Band>
          )}

          <div className="frame">
            <BankslipSection data={data} ctx={ctx} />

            <Band h>
              <Slot description="Pagador">{formatPerson(data.person, ctx)}</Slot>
            </Band>

            {/* Autenticação 1 */}
            <Band h id="autenticacao" style={{ flex: 2 }}>
              <Slot description="Autenticação mecânica" className="frameless">
                <div>&nbsp;</div>
                <div>&nbsp;</div>
              </Slot>
            </Band>
          </div>

          {/* Separator 2 */}
          <Band h id="separator2">
            <span>✂</span>
            <div style={{ flex: 1 }}>
              <hr />
            </div>
          </Band>

          <div className="frame">
            <BankslipSection data={data} ctx={ctx} />

            <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr" }}>
              <Band h style={{ flex: 2 }}>
                <Slot description="Instruções (texto de responsabilidade do beneficiário)">
                  <div>Confira se o e-mail do remetente é o mesmo do seu fornecedor.</div>
                  {!!data.wallet?.lateFee && (
                    <div>
                      {`Após o vencimento, cobrar multa de ${data.wallet?.lateFee}% (R$ ${utils.formatNumber(
                        round(data.value * (data.wallet?.lateFee / 100), 2),
                      )}).`}
                    </div>
                  )}
                  {!!data.wallet?.interestRateMonth && (
                    <div>
                      {`Após o vencimento, cobrar taxa de juros de ${data.wallet?.interestRateMonth}% ao mês (R$ ${utils.formatNumber(
                        round((data.value * (data.wallet?.interestRateMonth / 100)) / 30, 2),
                      )} ao dia).`}
                    </div>
                  )}
                  {!!data.wallet?.properties?.protestAfterDays && (
                    <div>{`Protestar após ${data.wallet?.properties.protestAfterDays} dias do vencimento.`}</div>
                  )}
                  {!!data.wallet?.properties?.billingMessage && (
                    <div>{data.wallet?.properties?.billingMessage}</div>
                  )}
                </Slot>
              </Band>

              <Band v>
                <Slot description="(-) Descontos/Abatimentos" className="right">
                  {utils.formatNumber(data.valueDiscount, { digits: 2 })}
                </Slot>
                <Slot description="(+) Mora/Multa" className="right">
                  {utils.formatNumber((data.fine ?? 0) + (data.interest ?? 0), { digits: 2 })}
                </Slot>
                <Slot description="Valor cobrado" className="right">
                  {utils.formatNumber(data.totalValue, { digits: 2 })}
                </Slot>
              </Band>
            </div>

            <Band h>
              <Slot description="Pagador">{formatPerson(data.person, ctx)}</Slot>
            </Band>
          </div>

          {/* Autenticação 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "4fr 3fr" }}>
            <div>
              {data.properties?.bankslip?.barcode && (
                <img
                  className="barcode"
                  src={`https://barcode.zensoft.com.br/?bcid=code128&text=${data.properties?.bankslip?.barcode}&scaleX=2&scaleY=1`}
                  alt="barcode"
                />
              )}
            </div>
            <div>
              <label>Autenticação mecânica</label>
            </div>
          </div>

          <Band h id="space" style={{ flex: 2 }} />
        </div>
      ))}
    </div>
  );
}

function formatPerson(person, ctx) {
  const { t } = ctx;

  const result = [];
  result.push(person.name);
  result.push(
    `${t(`/catalog/person/personDocumentType/enum/${person.documentType}`)} ${person.documentNumber}`,
  );
  if (person.street) {
    result.push(person.street);
  }
  result.push(person.number);
  if (person.complement) {
    result.push(person.complement);
  }
  if (person.district) {
    result.push(person.district);
  }
  if (person.city) {
    result.push(person.city.name);
    result.push(person.city.state.code);
  }
  if (person.zipcode) {
    result.push(`CEP ${person.zipcode}`);
  }

  return result.join(", ");
}

function checkDigit11(digits) {
  if (!digits) {
    return "";
  }

  let mult = 2;
  let sum = 0;
  for (let i = digits.length; i > 0; i--) {
    sum += parseInt(digits.substring(i - 1, i), 10) * mult;
    mult++;
    if (mult === 10) {
      mult = 2;
    }
  }
  const remainder = sum % 11;
  let result = 11 - remainder;
  if (result > 9) {
    result = 1;
  }
  return String(result);
}

function round(value, precision) {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function dateToDueDateFactor(date) {
  const base = Date.UTC(1997, 9, 7); // 07/10/1997
  const target = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  const diffDays = Math.floor((target - base) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return "0000";
  } // inválido antes da base

  if (diffDays <= 9999) {
    return diffDays.toString().padStart(4, "0");
  }
  // reinício em 1000 no novo ciclo
  const newCycle = diffDays - 9999 + 999; // shift para começar em 1000
  return newCycle.toString().padStart(4, "0");
}

function cd11(barcode) {
  let sum = 0;
  let mult = 2;
  for (let i = barcode.length - 1; i >= 0; i--) {
    sum += parseInt(barcode[i], 10) * mult;
    mult = mult === 9 ? 2 : mult + 1;
  }
  const remainder = sum % 11;
  const cd = 11 - remainder;
  if (cd === 0 || cd === 10 || cd === 11) {
    return 1;
  }
  return cd;
}

function generateBarcode(barcode, date, value) {
  if (barcode.length !== 44) {
    throw new Error(`Código inválido: esperado 44 dígitos, recebido ${barcode.length}`);
  }

  const bank = barcode.slice(0, 3); // 3
  const currency = barcode.slice(3, 4); // 1

  const freeField = barcode.slice(19, 44); // força exatamente 25

  const dueDateFactor = dateToDueDateFactor(date);

  const valueStr = Math.round(value * 100)
    .toString()
    .padStart(10, "0");

  const raw = bank + currency + dueDateFactor + valueStr + freeField;

  const dv = cd11(raw);

  return bank + currency + dv + dueDateFactor + valueStr + freeField;
}

function cd10(num) {
  let sum = 0;
  let peso = 2;

  for (let i = num.length - 1; i >= 0; i--) {
    let mult = parseInt(num[i], 10) * peso;
    if (mult > 9) {
      mult = Math.floor(mult / 10) + (mult % 10);
    }
    sum += mult;
    peso = peso === 2 ? 1 : 2;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

function barcodeToBarcodeFormatted(barcode) {
  if (!/^\d{44}$/.test(barcode)) {
    throw new Error("Código de barras inválido, precisa ter 44 dígitos");
  }

  const banco = barcode.slice(0, 3);
  const moeda = barcode.slice(3, 4);
  const dvGeral = barcode.slice(4, 5);
  const fatorVenc = barcode.slice(5, 9);
  const valor = barcode.slice(9, 19);
  const campoLivre = barcode.slice(19);

  const campo1 = banco + moeda + campoLivre.slice(0, 5);
  const campo2 = campoLivre.slice(5, 15);
  const campo3 = campoLivre.slice(15, 25);

  const dv1 = cd10(campo1);
  const dv2 = cd10(campo2);
  const dv3 = cd10(campo3);

  // aplica máscara com pontos e espaços
  const campo1f = `${campo1.slice(0, 5)}.${campo1.slice(5)}${dv1}`;
  const campo2f = `${campo2.slice(0, 5)}.${campo2.slice(5)}${dv2}`;
  const campo3f = `${campo3.slice(0, 5)}.${campo3.slice(5)}${dv3}`;

  return `${campo1f} ${campo2f} ${campo3f} ${dvGeral} ${fatorVenc}${valor}`;
}

function toUTCDate(input) {
  if (!input) {
    return null;
  }

  let date;

  if (typeof input === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      // formato YYYY-MM-DD → normaliza para meia-noite UTC
      const [year, month, day] = input.split("-").map(Number);
      date = new Date(Date.UTC(year, month - 1, day));
    } else {
      // string ISO completa (UTC timestamp)
      date = new Date(input);
      if (isNaN(date)) {
        throw new TypeError("Invalid date string");
      }
    }
  } else if (input instanceof Date) {
    date = new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  } else {
    throw new TypeError("Invalid date input");
  }

  return date;
}

function calculateInterest(row) {
  // Normalize dates to UTC (without hours)
  const today = toUTCDate(new Date());
  const dueDate = toUTCDate(new Date(row.dueDate));

  if (dueDate < today && row.wallet && row.wallet?.interestRateMonth) {
    const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    const rate = row.wallet?.interestRateMonth / 100;

    const months = diffDays / 30;

    let finalValue;
    if ((row.wallet?.tags ?? "").split(",").includes("compoundInterest")) {
      finalValue = row.balance * (1 + rate) ** months;
    } else {
      finalValue = row.balance * (1 + rate * months);
    }
    return Math.round((finalValue - row.balance) * 100) / 100;
  }
  return 0;
}

function adjustWeekend(date) {
  if (!date) {
    return null;
  }

  const day = date.getUTCDay(); // 0 = domingo, 6 = sábado
  console.log(day);
  if (day === 6) {
    // sábado → adiciona 2 dias
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 2));
  } else if (day === 0) {
    // domingo → adiciona 1 dia
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
  }
  return date; // já é dia útil
}
