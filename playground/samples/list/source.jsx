export default function SampleReportList() {
  return (
    <>
      <div class="report-container">
        <span class="stamp">DRAFT</span>

        <header>
          <div class="brand">
            <img src="logo.png" alt="Company Logo" />
              <p>Nexus Solutions Group<br />123 Enterprise Dr, Austin TX</p>
          </div>
          <h1>Quarterly Performance Report</h1>
          <dl>
            <div><dt>Period</dt><dd>Q4 2025</dd></div>
            <div><dt>Author</dt><dd>Financial Dept.</dd></div>
            <div><dt>Currency</dt><dd>USD</dd></div>
          </dl>
        </header>

        <div class="page-header">Confidential - Nexus Solutions Group</div>

        <main>
          <div class="kpi-grid">
            <dl>
              <div><dt>Total Revenue</dt><dd>$1.2M</dd></div>
              <span class="kpi-trend text-success">↑ 12%</span>
            </dl>
            <dl>
              <div><dt>Active Clients</dt><dd>458</dd></div>
              <span class="kpi-trend text-danger">↓ 2%</span>
            </dl>
          </div>

          <section>
            <header>Region: North America</header>
            <div class="content">

              <section>
                <header>Territory: Northeast</header>
                <div class="content">
                  <table>
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th class="text-right">Volume</th>
                        <th class="text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Acme Corp</td><td class="text-right">500</td><td class="text-right">$50,000</td></tr>
                      <tr><td>Global Ind.</td><td class="text-right">250</td><td class="text-right">$25,000</td></tr>
                    </tbody>
                    <tfoot>
                      <tr><td colspan="2">Subtotal</td><td class="text-right">$75,000</td></tr>
                    </tfoot>
                  </table>
                </div>
                <footer>Territory status: Exceeding Quota</footer>
              </section>

            </div>
            <footer>Regional Manager: Sarah Jenkins</footer>
          </section>
        </main>

        <div class="page-footer">Page <span class="page-num"></span> of <span class="page-total"></span></div>

        <footer>
          <p>This report is generated automatically. Final audit pending for Q4 close.</p>
          <div class="signature-block">
            <span>Approved by: ________________________</span>
            <span>Date: ________________</span>
          </div>
        </footer>
      </div>
    </>
  );
}