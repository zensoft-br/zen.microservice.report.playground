import React from "react";
import * as utils from "./utils.js";

export default function ({ data = [], t }) {
  const taxList = ["ICMS", "IPI"];

  return (
    <div className="report-wrapper">
      {data.map((obj) => (
        <div className="report-container">
          <header>
            <h1 className="grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
              <img src={obj.company_logo} style={{ objectFit: "contain" }} />
              <span>{t("/sale/sale")} {obj.id}</span>
              <img src={`https://barcode.zensoft.com.br?bcid=qrcode&text=${obj.id}`} style={{ width: "2cm", justifySelf: "end" }} />
            </h1>
            <div className="flex v gap" style={{ fontSize: "0.8rem" }}>
              <section className="parameters">
                <dl>
                  <dt>{t("/catalog/company/company")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>CNPJ</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>Inscrição estadual</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl style={{ flex: "3" }}>
                  <dt>{t("/@word/address")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl style={{ flex: "2" }}>
                  <dt>{t("/@word/email")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl style={{ flex: "1" }}>
                  <dt>{t("/@word/phone")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/customer")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>CNPJ</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>Inscrição estadual</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl style={{ flex: "3" }}>
                  <dt>{t("/@word/address")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl style={{ flex: "2" }}>
                  <dt>{t("/@word/email")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl style={{ flex: "1" }}>
                  <dt>{t("/@word/phone")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/sale/saleProfile")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/code")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/date")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/availabilityDate")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/status")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/tags")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/freightType")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/personShipping")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/personShippingTransshipment")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/personSalesperson")}</dt>
                  <dd>Value 1</dd>
                </dl>
                <dl>
                  <dt>{t("/@word/paymentMethods")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
              <section className="parameters">
                <dl>
                  <dt>{t("/@word/comments")}</dt>
                  <dd>Value 1</dd>
                </dl>
              </section>
            </div>
          </header>
          <main>
            <div className="content">
              {/* <div className="flex v framed row">
                  <div className="flex h">
                    <div className="flex v">
                      <dl>
                        <dt>Key 1</dt>
                        <dd>Value 1</dd>
                      </dl>
                      <dl>
                        <dt>Key 2a</dt>
                        <dd>Value 2a</dd>
                      </dl>
                    </div>
                    <dl>
                      <dt>Key 2</dt>
                      <dd>Value 2</dd>
                    </dl>
                  </div>
                  <div className="band h" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <dl>
                      <dt>Key 1</dt>
                      <dd>Value 1</dd>
                    </dl>
                    <dl>
                      <dt>Key 2</dt>
                      <dd>Value 2</dd>
                    </dl>
                    <dl>
                      <dt>Key 3</dt>
                      <dd>Value 3</dd>
                    </dl>
                  </div>
                </div> */}
              <table>
                <thead>
                  <tr>
                    <th>{t("/@word/code")}</th>
                    <th>{t("/@word/description")}</th>
                    <th>{t("/fiscal/taxation/taxationOperation")}</th>
                    <th className="number">{t("/@word/quantity")}</th>
                    <th></th>
                    <th className="number">{t("/@word/unitValue")}</th>
                    <th className="number">{t("/@word/productValue")}</th>
                    <th className="number">{t("/@word/totalValue")}</th>
                    {taxList.map((tax) => (
                      <>
                        <th key={tax} className="number">{tax} %</th>
                        <th key={tax} className="number">{tax}</th>
                      </>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {obj.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productPacking.code}</td>
                      <td>{[
                        item.product_description,
                        item.productPacking_complement,
                        item.productVariant_description,
                      ].filter(Boolean).join(", ")}
                      </td>
                      <td>{item.taxationOperation_code}</td>
                      <td className="number">{utils.formatNumber(item.item_quantity)}</td>
                      <td>{item.unit_code}</td>
                      <td className="number">{utils.formatCurrency(item.item_unitValue, { maximumFractionDigits: 8 })}</td>
                      <td className="number">{utils.formatCurrency(item.item_grossProductValue)}</td>
                      <td className="number">{utils.formatCurrency(item.item_totalValue)}</td>
                      {taxList.map((tax) => (
                        <>
                          <td key={tax} className="number">{utils.formatNumber(item[`tax_${tax}_taxRate`] ?? 0)}</td>
                          <td key={tax} className="number">{utils.formatCurrency(item[`tax_${tax}_taxValue`] ?? 0)}</td>
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="number">{utils.formatNumber(obj.items?.reduce((sum, item) => sum + item.item_quantity, 0))}</td>
                    <td></td>
                    <td></td>
                    <td className="number">{utils.formatCurrency(obj.items?.reduce((sum, item) => sum + item.item_grossProductValue, 0))}</td>
                    <td className="number">{utils.formatCurrency(obj.items?.reduce((sum, item) => sum + item.item_totalValue, 0))}</td>
                    {taxList.map((tax) => (
                      <React.Fragment key={tax}>
                        <td></td>
                        <td className="number">{utils.formatCurrency(obj.items?.reduce((sum, item) => sum + (item[`tax_${tax}_taxValue`] ?? 0), 0))}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};
