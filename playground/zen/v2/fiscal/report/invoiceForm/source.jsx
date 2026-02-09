export default function ({ data = [], t }) {
  return (
    <div className="report-wrapper">
      {data.map((item, index) => (
        <div className="report-container page">

          {/* COMPROVANTE */}
          <div className="band h frame" style={{ gridTemplateColumns: '80% 20%' }}>
            <div className="band v">
              <div className="slot" style={{ fontSize: '90%' }}>
                Recebemos de {item.company.person.name} os produtos e/ou serviços constantes da nota fiscal nº {item.number}, emissão: {item.date}, valor total {item.totalValue}, destinatário {item.person.name}, endereço {item.person.address}.
              </div>
              <div className="band h">
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
            <div className="slot">
              <div className="band v center">
                <div><b>NF-e</b></div>
                <div>&nbsp;</div>
                <div>Nº 1234 Série 1</div>
              </div>
            </div>
          </div>

          {/* HR */}
          <hr className="dashed" />

          {/* HEADER */}
          <div className="band v frame">
            <div className="band h" style={{ gridTemplateColumns: '15% 35% 15% 35%' }}>
              <div className="slot">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Vanamo_Logo.png" alt="Logo" />
              </div>
              <div className="band v">
                <div className="slot">
                  <label>Identificação do emitente</label>
                  <div>SQUIB TECNOLOGIA ELETRÔNICA IMP E E</div>
                </div>
                <div className="slot">
                  <div>CONFERÊNCIA</div>
                </div>
              </div>
              <div className="slot">
                <div className="band v center">
                  <div><b>DANFE</b></div>
                  <div>&nbsp;</div>
                  <div>Documento auxiliar de nota fiscal eletrônica</div>
                  <div>&nbsp;</div>
                  <div>1 - Saída</div>
                  <div>Nº 1234 Série 1</div>
                </div>
              </div>
              <div className="band v">
                <div className="slot">
                  <img src={`https://barcode.zensoft.com.br?bcid=code128&scaleX=2&scaleY=1&text=${item.dfe.chNFe}`} />
                </div>
                <div className="slot">
                  <label>Chave de acesso</label>
                  <div style={{ fontSize: '90%', textAlign: 'center' }}>
                    {item.dfe.chNFe}
                  </div>
                </div>
                <div className="slot">
                  <div style={{ fontSize: '85%', textAlign: 'center' }}>
                    Consulta de autenticidade no portal nacional da NF-e www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora
                  </div>
                </div>
              </div>
            </div>
            <div className="band h">
              <div className="slot">
                <label>Natureza da operação</label>
                <div>Venda de mercadoria adquirida ou recebida de terceiros</div>
              </div>
              <div className="slot">
                <label>Protocolo de autorização de uso</label>
                <div>135230856296403 02/06/2023 13:29:22</div>
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
                <div>68.442.508/0001-83</div>
              </div>
            </div>
          </div>

          {/* DESTINATARIO */}
          <label className="header">Destinatário / Remetente</label>
          <div className="band v frame">
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
                <div>{item.date}</div>
              </div>
            </div>
            <div className="band h" style={{ gridTemplateColumns: '50% 17% 16% 17%' }}>
              <div className="slot">
                <label>{t("/@word/address")}</label>
                <div>RUA MANOEL RODRIGUES DA ROCHA, 98</div>
              </div>
              <div className="slot">
                <label>{t("/@word/district")}</label>
                <div>PARQUE SANTA RITA</div>
              </div>
              <div className="slot">
                <label>{t("/@word/zipcode")}</label>
                <div>08150060</div>
              </div>
              <div className="slot">
                <label>{t("/@word/exitDate")}</label>
                <div></div>
              </div>
            </div>
          </div>

          <label className="header">Fatura / Duplicatas</label>
          <div className="flex h gap slot">
            {item.billingTitles?.map((billingTitle) => (
              <div key={billingTitle.id}>
                <div>{billingTitle.dueDate}</div>
                <div>{billingTitle.value}</div>
              </div>
            ))}
          </div>

          {/* IMPOSTO (Summary example) */}
          <label className="header">Cálculo do imposto</label>
          <div className="band v frame">
            <div className="band h">
              <div className="slot">
                <label>Base cálc. ICMS</label>
                <div className="number">{item.taxationSummary.ICMS?.baseValue}</div>
              </div>
              <div className="slot">
                <label>Valor ICMS</label>
                <div className="number">{item.taxationSummary.ICMS?.taxValue}</div>
              </div>
              <div className="slot">
                <label>Total da nota</label>
                <div className="number">1.186,92</div>
              </div>
            </div>
          </div>

          {/* PRODUTOS TABLE */}
          <label className="header">Dados dos produtos / serviços</label>
          <div className="band v">
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
                {item.items.map((_, index) => (
                  <tr key={index}>
                    <td>90012.FORDATA/1508, DISPLAY 16X2 S/BACK (FECC1602E-RNNGBW-66LE), FORDATA</td>
                    <td>85241100</td>
                    <td>102</td>
                    <td>5.102</td>
                    <td>un</td>
                    <td className="number">6.000</td>
                    <td className="number">16,90</td>
                    <td className="number">1.550,00</td>
                    <td className="number">1.593,00</td>
                    <td className="number">0,00</td>
                    <td className="number">0</td>
                    <td className="number">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DADOS ADICIONAIS */}
          <label className="header">Dados adicionais</label>
          <div className="band v frame">
            <div className="band h" style={{ minHeight: '3cm', maxHeight: '3cm' }}>
              <div className="slot">
                <label>Informações complementares</label>
                <div>y</div>
              </div>
              <div className="slot">
                <label>Reservado ao fisco</label>
                <div>y</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
