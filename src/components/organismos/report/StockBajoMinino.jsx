import styled from "styled-components";
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer } from "@react-pdf/renderer"
import { useProductosStore } from "../../../store/ProductosStore";
import { useEmpresaStore } from "../../../store/EmpresaStore"
import { useQuery } from "@tanstack/react-query";

function StockBajoMinimo() {
    const { reportBajoMinimo } = useProductosStore();
    const { dataempresa } = useEmpresaStore()

    const { data } = useQuery({
        queryKey: ["reporte stock bajo minimo", { id_empresa: dataempresa?.id }],
        queryFn: () => reportBajoMinimo({ id_empresa: dataempresa?.id }), enabled: !!dataempresa

    })
    const styles = StyleSheet.create({
        page: { flexDirection: "row", position: "relative" },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        table: { width: "100%", margin: "auto", marginTop: 10 },
        row: {
            flexDirection: "row",
            borderBottom: 1,
            borderBottomColor: "#121212",
            height: 24,
            borderLeftColor: "#000",
            borderLeft: 1,
            textAlign: "left",
            justifyContent: "flex-start",
            alignItems: "center",

        },
        cell: {
            flex: 1,
            textAlign: "center",
            borderLeftColor: "#000",
            justifyContent: "flex-start",
            alignItems: "center",

        },
        headerCell: {
            flex: 1,
            backgroundColor: "#dcdcdc",
            fontWeight: "bold",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center"

        }
    });
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
    const renderTableRow = (rowData, isHeader = false) => (
        <View style={styles.row} key={rowData.id}>
            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {
                    rowData.descripcion
                }
            </Text>
            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {rowData.stock}
            </Text>
            <Text style={[styles.cell, isHeader && styles.headerCell]}>
                {rowData.stock_minimo}
            </Text>
        </View>
    );
    return (
        <Container>
            <PDFViewer className="pdfviewer">
                <Document title="Reporte de stock bajo minimo">
                    <Page size="A4" orientation="portrait">
                        <View style={styles.page}>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 18, fontWeight: "ultrabold", marginBottom: 10 }}>
                                    Stock bajo minimo
                                </Text>
                                <Text>
                                    Fecha y hora del reporte: {formattedDate}
                                </Text>
                                <View>
                                    {
                                        renderTableRow(
                                            {
                                                descripcion: "Producto",
                                                stock: "Stock",
                                                stock_minimo: "Stock Minimo"
                                            },
                                            true
                                        )}
                                    {
                                        data?.map((item) => renderTableRow(item))

                                    }
                                </View>
                            </View>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 80vh;
    .pdfviewer{
        width: 100%;
        height: 100%;    
    }
`

export default StockBajoMinimo;