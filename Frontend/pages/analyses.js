import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useState } from "react";

export default function Home() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [ironNormalization, setIronNormalization] = useState(false);
    const [qcNormalization, setQcNormalization] = useState(false);
    const [responseTable, setResponseTable] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file1", file1);
        formData.append("file2", file2);
        if (ironNormalization) {
            formData.append("normalization", "IRON",);
        } else if (qcNormalization) {
            formData.append("normalization", "QC");
        }

        const response = await fetch("http://0.0.0.0:80/metabolomics_glue", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log(data);
        setResponseTable(data);
    };

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Select the analyses</p>
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        File 1:
                        <input type="file" onChange={(event) => setFile1(event.target.files[0])} />
                    </label>
                </div>
                <div>
                    <label>
                        File 2:
                        <input type="file" onChange={(event) => setFile2(event.target.files[0])} />
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={ironNormalization} onChange={(event) => setIronNormalization(event.target.checked)} />
                        IRON normalization
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={qcNormalization} onChange={(event) => setQcNormalization(event.target.checked)} />
                        QC normalization
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
            {responseTable.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            {Object.keys(responseTable[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {responseTable.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, index) => (
                                    <td key={index}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </section>
    </Layout>
  );
}
