import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useState } from "react";
import fetch from 'isomorphic-fetch';
import * as XLSX from 'xlsx'

export default function Home() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [ironNormalization, setIronNormalization] = useState(false);
    const [qcNormalization, setQcNormalization] = useState(false);
    const [responseTable, setResponseTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    // const pageNumbers = [];
    // for (let i = 1; i <= Math.ceil(responseTable.length / itemsPerPage); i++) {
    //     pageNumbers.push(i);
    // }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file1", file1);
        formData.append("file2", file2);
        if (ironNormalization) {
            formData.append("normalization", "IRON",);
        } else if (qcNormalization) {
            formData.append("normalization", "QC");
        }

        try {
            const response = await fetch("http://localhost:80/metabolomics_glue", { method: "POST", body: formData });
            const data = await response.json();
            console.log(data);
            setResponseTable(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setIsLoading(false);
        }
    };

    // function renderTable(data, currentPage) {
    //     const itemsPerPage = 500;
    //     const indexOfLastItem = currentPage * itemsPerPage;
    //     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //     const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
      
    //     const headers = Object.keys(currentItems[0]);
      
    //     const tableHeaders = headers.map(header => {
    //       return <th key={header}>{header}</th>;
    //     });
      
    //     const tableRows = currentItems.map(item => {
    //       const rowCells = headers.map(header => {
    //         return <td key={header}>{item[header]}</td>;
    //       });
    //       return <tr key={item.id}>{rowCells}</tr>;
    //     });
      
    //     return (
    //       <table>
    //         <thead>
    //           <tr>{tableHeaders}</tr>
    //         </thead>
    //         <tbody>{tableRows}</tbody>
    //       </table>
    //     );
    //   }

    const downloadTable = () => {
        const worksheet = XLSX.utils.json_to_sheet(responseTable[0]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "iron_log2.xlsx");
    };
    const downloadTable1 = () => {
        const worksheet = XLSX.utils.json_to_sheet(responseTable[1]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "qc_normalized.xlsx");
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
                    {isLoading && <div>Loading...</div>}
                    {responseTable.length > 0 && (
                        <div>
                            <div>
                                <button onClick={downloadTable}>Download IRON log2 as XLSX</button>
                            </div>
                            <div>
                                <button onClick={downloadTable1}>Download QC normalized as XLSX</button>
                            </div>
                            {/* <div>
                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} key={currentPage}>Previous</button>
                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumbers.length} key={currentPage + 1}>Next</button>
                            </div>
                            {renderTable(responseTable, currentPage)} */}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}