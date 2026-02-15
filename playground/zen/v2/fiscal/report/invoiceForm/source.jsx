import React from "react";

export default function ({ data = [], t }) {
  data.forEach(item => {
    item.billingTitles = item.billingTitles.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  });

  return (
    <div className="report-wrapper">
      {data.map((item, index) => (
        <div className="report-container">

          <main>
            {/* COMPROVANTE */}
            <div className="frame">
              <div className="grid band h" style={{ gridTemplateColumns: '4fr 1fr' }}>
                <div className="band v">
                  <div className="slot" style={{ fontSize: '90%' }}>
                    Recebemos de {item.company.person.name} os produtos e/ou serviços constantes da nota fiscal nº {number(item.number, 0)}, emissão: {date(item.date)}, valor total {currency(item.totalValue)}, destinatário {item.person.name}, endereço {address(item.person)}.
                  </div>
                  <div className="band h" style={{ minHeight: "1cm" }}>
                    <div className="slot">
                      <label>Data do recebimento</label>
                      <div>&nbsp;</div>
                    </div>
                    <div className="slot">
                      <label>Identificação e assinatura do recebedor</label>
                      <div>&nbsp;</div>
                    </div>
                  </div>
                </div>
                <div className="slot flex v align-center justify-space-around text-center">
                  <div><b>NF-e</b></div>
                  <div>Nº {number(item.number)} Série {item.invoiceSeries.properties?.fiscal_br_serie}</div>
                </div>
              </div>
            </div>

            {/* HR */}
            <hr className="dashed" />

            {/* HEADER */}
            <div className="frame">
              <div className="band h" style={{ gridTemplateColumns: "2fr 5fr 2fr 7fr" }}>
                <div className="slot">
                  <img src={item.company.image.url} />
                </div>
                <div className="slot flex v align-center justify-space-around text-center">
                  <label>Identificação do emitente</label>
                  <strong>{item.company.person.name}</strong>
                  <div>{address(item.company.person)}</div>
                  <div>{[item.company.person.district, item.company.person.city.name, item.company.person.city.state.code, item.company.person.zipcode ? `${t("/@word/zipcode")} ${item.company.person.zipcode}` : ""].filter(Boolean).join(', ')}</div>
                  {item.company.person.phone && <div>{t("/@word/phone")} {item.company.person.phone}</div>}
                  {item.company.person.email && <div>{t("/@word/email")} {item.company.person.email}</div>}
                </div>
                <div className="slot flex v align-center justify-space-around text-center" style={{ justifyContent: "space-around" }}>
                  <strong>DANFE</strong>
                  <div>Documento auxiliar de nota fiscal eletrônica</div>
                  <div>1 - Saída</div>
                  <div>Nº {number(item.number)} Série {item.invoiceSeries.properties?.fiscal_br_serie}</div>
                </div>
                <div className="band v">
                  <div className="slot">
                    <img src={`https://barcode.zensoft.com.br?bcid=code128&scaleX=2&scaleY=1&text=${item.dfe.chNFe}`} style={{ objectFit: "cover" }} />
                  </div>
                  <div className="slot">
                    <label>Chave de acesso</label>
                    <div style={{ textAlign: 'center' }}>
                      {splitInBlocks(item.dfe.chNFe)}
                    </div>
                  </div>
                  <div className="slot">
                    <div style={{ textAlign: 'center' }}>
                      Consulta de autenticidade no portal nacional da NF-e www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora
                    </div>
                  </div>
                </div>
              </div>
              <div className="band h">
                <div className="slot">
                  <label>Natureza da operação</label>
                  <div>{item.items[0]?.taxationOperation.description}</div>
                </div>
                <div className="slot">
                  <label>Protocolo de autorização de uso</label>
                  <div>{item.dfe.nProt}, {date(item.dfe.dateTime.substring(0, 10))}, {item.dfe.dateTime.substring(11, 19)}</div>
                </div>
              </div>
              <div className="band h">
                <div className="slot">
                  <label>Inscrição estadual</label>
                  <div>{item.company.person.document2Number}</div>
                </div>
                <div className="slot">
                  <label>Inscrição estadual do subst. tribut.</label>
                  <div></div>
                </div>
                <div className="slot">
                  <label>CNPJ</label>
                  <div>{item.company.person.documentNumber}</div>
                </div>
              </div>
            </div>

            <div className="content">
              {/* DESTINATARIO */}
              <label className="header">Destinatário / Remetente</label>
              <div className="frame">
                <div className="band h" style={{ gridTemplateColumns: '50% 25% 25%' }}>
                  <div className="slot">
                    <label>{t("/@word/name")}</label>
                    <div>{item.person.name}</div>
                  </div>
                  <div className="slot">
                    <label>CNPJ</label>
                    <div>{item.person.documentNumber}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/issueDate")}</label>
                    <div>{date(item.date)}</div>
                  </div>
                </div>
                <div className="band h" style={{ gridTemplateColumns: '50% 17% 17% 16%' }}>
                  <div className="slot">
                    <label>Endereço</label>
                    <div>{[item.person.street, item.person.number, item.person.complement].filter(Boolean).join(', ')}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/district")}</label>
                    <div>{item.person.district}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/zipcode")}</label>
                    <div>{item.person.zipcode}</div>
                  </div>
                  <div className="slot">
                    <label>Data saída</label>
                    <div></div>
                  </div>
                </div>
                <div className="band h" style={{ gridTemplateColumns: '45% 5% 17% 17% 16%' }}>
                  <div className="slot">
                    <label>{t("/catalog/location/city")}</label>
                    <div>{item.person.city.name}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/catalog/location/state")}</label>
                    <div>{item.person.city.state.code}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/phone")}</label>
                    <div>{item.person.phone}</div>
                  </div>
                  <div className="slot">
                    <label>Inscrição estadual</label>
                    <div>{item.person.document2Number}</div>
                  </div>
                  <div className="slot">
                    <label>Hora saída</label>
                    <div></div>
                  </div>
                </div>
              </div>

              {/* BILLING */}
              <label className="header">Fatura / Duplicatas</label>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
                {[0, 1, 2].map((colIndex) => (
                  <div key={colIndex} className="frame">
                    <table style={{ width: "100%", borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th>{t("/@word/number")}</th>
                          <th>{t("/@word/dueDate")}</th>
                          <th className="number">{t("/@word/value")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: Math.ceil(item.billingTitles.length / 3) }).map((_, rowIndex) => {
                          const titleIndex = rowIndex + (colIndex * Math.ceil(item.billingTitles.length / 3));
                          const billingTitle = item.billingTitles[titleIndex];

                          return (
                            <tr key={rowIndex}>
                              <td>{billingTitle?.code || <>&nbsp;</>}</td>
                              <td className="date">{billingTitle?.dueDate ? date(billingTitle.dueDate) : <>&nbsp;</>}</td>
                              <td className="number">{billingTitle?.value ? currency(billingTitle.value) : <>&nbsp;</>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* IMPOSTO */}
              <label className="header">Cálculo do imposto</label>
              <div className="frame" >
                <div className="band h" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                  <div className="slot">
                    <label>Base cálc. ICMS</label>
                    <div className="number">{currency(item.taxationSummary.ICMS?.baseValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor ICMS</label>
                    <div className="number">{currency(item.taxationSummary.ICMS?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Base cálc. ICMS ST</label>
                    <div className="number">{currency(item.taxationSummary.ICMS_ST?.baseValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor ICMS ST</label>
                    <div className="number">{currency(item.taxationSummary.ICMS_ST?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor IPI</label>
                    <div className="number">{currency(item.taxationSummary.IPI?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor II</label>
                    <div className="number">{currency(item.taxationSummary.II?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor dos produtos</label>
                    <div className="number">{currency(item.items.reduce((acc, item) => acc + (item.productValue ?? 0), 0))}</div>
                  </div>
                </div>
                <div className="band h" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
                  <div className="slot">
                    <label>Valor Frete</label>
                    <div className="number">{currency(item.items.reduce((acc, item) => acc + (item.otherValues.freightValue ?? 0), 0))}</div>
                  </div>
                  <div className="slot">
                    <label>Valor seguro</label>
                    <div className="number">{currency(item.items.reduce((acc, item) => acc + (item.otherValues.insuranceValue ?? 0), 0))}</div>
                  </div>
                  <div className="slot">
                    <label>Valor desconto</label>
                    <div className="number">{currency(item.items.reduce((acc, item) => acc + (item.discountValue ?? 0), 0))}</div>
                  </div>
                  <div className="slot">
                    <label>Outras despesas</label>
                    <div className="number">{currency(0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor PIS</label>
                    <div className="number">{currency(item.taxationSummary.PIS?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Valor COFINS</label>
                    <div className="number">{currency(item.taxationSummary.COFINS?.taxValue ?? 0)}</div>
                  </div>
                  <div className="slot">
                    <label>Total da nota</label>
                    <div className="number">{currency(item.totalValue ?? 0)}</div>
                  </div>
                </div>
              </div>

              {/* TRANSPORTE */}
              <label className="header">Transportador / Volumes transportados</label>
              <div className="frame">
                <div className="band h" style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 0.5fr 1.5fr' }}>
                  <div className="slot">
                    <label>Nome / Razão social</label>
                    <div>{item.personShipping?.name}</div>
                  </div>
                  <div className="slot">
                    <label>Frete por conta</label>
                    <div>{item.freightType === "RECIPIENT" ? "1 - Destinatário" : "0 - Emitente"}</div>
                  </div>
                  <div className="slot">
                    <label>Código ANTT</label>
                    <div>{item.personShipping?.properties?.brAnttCode}</div>
                  </div>
                  <div className="slot">
                    <label>Placa do veículo</label>
                    <div>{item.shipment?.properties?.licensePlate}</div>
                  </div>
                  <div className="slot">
                    <label>UF</label>
                    <div>{item.shipment?.properties?.licensePlateState}</div>
                  </div>
                  <div className="slot">
                    <label>CNPJ</label>
                    <div>{item.personShipping?.documentNumber}</div>
                  </div>
                </div>
                <div className="band h" style={{ gridTemplateColumns: '4.5fr 2fr 0.5fr 2fr' }}>
                  <div className="slot">
                    <label>Endereço</label>
                    <div>{[item.personShipping?.street, item.personShipping?.number, item.personShipping?.complement].filter(Boolean).join(', ')}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/catalog/location/city")}</label>
                    <div>{item.personShipping?.city?.name}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/catalog/location/state")}</label>
                    <div>{item.personShipping?.city?.state?.code}</div>
                  </div>
                  <div className="slot">
                    <label>Inscrição estadual</label>
                    <div>{item.personShipping?.document2Number}</div>
                  </div>
                </div>
                <div className="band h" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
                  <div className="slot">
                    <label>{t("/@word/quantity")}</label>
                    <div className="number">{number(item.properties?.volumes)}</div>
                  </div>
                  <div className="slot">
                    <label>Espécie</label>
                    <div>Volumes</div>
                  </div>
                  <div className="slot">
                    <label>Marca</label>
                    <div>&nbsp;</div>
                  </div>
                  <div className="slot">
                    <label>Numeração</label>
                    <div>&nbsp;</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/grossWeightKg")}</label>
                    <div className="number">{number(item.grossWeightKg)}</div>
                  </div>
                  <div className="slot">
                    <label>{t("/@word/netWeightKg")}</label>
                    <div className="number">{number(item.netWeightKg)}</div>
                  </div>
                </div>
              </div>

              {/* PRODUTOS TABLE */}
              <label className="header">Dados dos produtos / serviços</label>
              <div className="frame">
                <table>
                  <thead>
                    <tr>
                      <th>Descrição do produto / serviço</th>
                      <th>NCM</th>
                      <th>CST</th>
                      <th>CFOP</th>
                      <th>UN</th>
                      <th className="number">Quant</th>
                      <th className="number">Valor unit</th>
                      <th className="number">Valor total</th>
                      <th className="number">B. cálc. ICMS</th>
                      <th className="number">Valor ICMS</th>
                      <th className="number">ICMS %</th>
                      <th className="number">IPI %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.items.map((item1, index) => (
                      <tr key={index}>
                        <td>{[
                          item1.productPacking.code,
                          item1.productPacking.product.description,
                          item1.productPacking.complement,
                          item1.productPacking.variant.description].filter(Boolean).join(', ')}</td>
                        <td>{item1.productPacking.product.properties?.fiscal_br_NCM}</td>
                        <td>102</td>
                        <td>{item1.taxationOperation.code}</td>
                        <td>{item1.productPacking.product.unit.code}</td>
                        <td className="number">{number(item1.quantity)}</td>
                        <td className="number">{currency(item1.unitValue)}</td>
                        <td className="number">{currency(item1.productValue)}</td>
                        <td className="number">{currency(item1.taxations.filter(e => e.tax.code === "ICMS")[0]?.baseValue ?? 0)}</td>
                        <td className="number">{currency(item1.taxations.filter(e => e.tax.code === "ICMS")[0]?.taxValue ?? 0)}</td>
                        <td className="number">{number(item1.taxations.filter(e => e.tax.code === "ICMS")[0]?.taxRate ?? 0)}</td>
                        <td className="number">{number(item1.taxations.filter(e => e.tax.code === "IPI")[0]?.taxRate ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DADOS ADICIONAIS */}
              <label className="header">Dados adicionais</label>
              <div className="frame">
                <div className="band h" style={{ minHeight: '3cm', maxHeight: '3cm' }}>
                  <div className="slot">
                    <label>Informações complementares</label>
                    <div>{[
                      item.properties?.["#comments"],
                      item.properties?.["comments"],
                    ].filter(Boolean).join('\n')}</div>
                  </div>
                  <div className="slot">
                    <label>Reservado ao fisco</label>
                    <div style={{ fontSize: "0.5rem", position: "absolute", bottom: "0.2rem", right: "0.2rem" }} >https://zenerp.com.br</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ))}
    </div>
  );
};

function date(s) {
  if (s == null) return null;
  const date = new Date(s);
  return date.toLocaleDateString("pt-BR");
}

function number(v, digits = 0) {
  if (v == null) return null;
  return v.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function currency(v, { currency = "BRL", digits = 2 } = {}) {
  if (v == null) return null;
  return v.toLocaleString("pt-BR", { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function address({ street, number, complement }) {
  return [street, number, complement].filter(Boolean).join(', ');
}

const splitInBlocks = (str, size = 4) => {
  if (str == null) return null;
  const regex = new RegExp(`.{1,${size}}`, 'g');
  return str.match(regex).join(' ');
};