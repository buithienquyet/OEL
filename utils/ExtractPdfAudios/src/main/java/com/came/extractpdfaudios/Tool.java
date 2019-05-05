/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.came.extractpdfaudios;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.annot.*;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.rendering.PDFRenderer;

/**
 *
 * @author quyet
 */
public class Tool {

    private static String getFileNameWithoutExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index == -1) {
            return fileName;
        } else {
            return fileName.substring(0, index);
        }
    }

    private static void getThumb(String fileLocation, String outputLocation) {
        try {
            PDDocument doc = PDDocument.load(new File(fileLocation));
            PDFRenderer pdfRenderer = new PDFRenderer(doc);

            BufferedImage bim = pdfRenderer.renderImage(0);
            ImageIO.write(bim, "jpg", new File(outputLocation));

            doc.close();

        } catch (Exception e) {
            System.out.println(e);
            System.exit(1);
        }
    }

    private static boolean isScreenObject(PdfObject o) {
        if (!o.isDictionary()) {
            return false;
        }

        Object subType = ((PdfDictionary) o).get(PdfName.Subtype);

        if (subType == null) {
            return false;
        }

        return PdfName.Screen.equals(subType);
    }

    public static void GetAudiosFromPdf(String fileLocation, String outputFolder) {
        try {

            File docFile = new File(fileLocation);
            // String outputFolderName = getFileNameWithoutExtension(docFile.getName());
            String outputFolderName = outputFolder;
            // create output folder
            new File(outputFolderName).mkdir();
            
            FileWriter audioOutputFile = new FileWriter(new File(outputFolderName + "\\audio.txt"));

            PdfDocument pdfDoc = new PdfDocument(new PdfReader(fileLocation));
            ArrayList<PdfObject> objList = new ArrayList<PdfObject>();
            ArrayList<PdfDictionary> pdfDicList = new ArrayList<PdfDictionary>();
            ArrayList<PdfDictionary> pdfScreenList = new ArrayList<PdfDictionary>();
            ArrayList<PdfDictionary> pdfStampList = new ArrayList<PdfDictionary>();
            int pageLength = pdfDoc.getNumberOfPages();
            int objectCnt = pdfDoc.getNumberOfPdfObjects();

           

            // getThumb(fileLocation, outputFolderName + "\\thumbnail.jpg");

            for (int i = 1; i < objectCnt; i++) {
                PdfObject obj;

                obj = pdfDoc.getPdfObject(i);
                objList.add(obj);

                if (isScreenObject(obj)) {
                    pdfScreenList.add((PdfDictionary) obj);
                }

                obj.getIndirectReference().getObjNumber();
            }

            for (PdfDictionary screen : pdfScreenList) {
                int screenObjectNumber = screen.getIndirectReference().getObjNumber();
                PdfScreenAnnotation screenAnnotation = (PdfScreenAnnotation) PdfScreenAnnotation.makeAnnotation(screen);

                Rectangle screenRectangle = screen.getAsRectangle(PdfName.Rect);
                PdfDictionary pageDic = screen.getAsDictionary(PdfName.P);
                PdfPage page = screenAnnotation.getPage();

                Rectangle pageRectangle = pageDic.getAsRectangle(PdfName.CropBox);

                double absoluteScreenWidth = screenRectangle.getWidth() / pageRectangle.getWidth() * 100;
                double absoluteScreenHeight = screenRectangle.getHeight() / pageRectangle.getHeight() * 100;
                double absoluteScreenTop = 100 - (screenRectangle.getBottom() - pageRectangle.getBottom() + screenRectangle.getHeight()) / pageRectangle.getHeight() * 100;
                double absoluteScreenLeft = (screenRectangle.getLeft() - pageRectangle.getLeft()) / pageRectangle.getWidth() * 100;
                int pageNumber = pdfDoc.getPageNumber(pageDic);

                // System.out.println("page "+pageNumber+ ": "+absoluteScreenLeft+ " "+absoluteScreenWidth+ " "+absoluteScreenHeight);
                PdfDictionary action = screenAnnotation.getAction();
                PdfDictionary redition = action.getAsDictionary(PdfName.R);
                PdfDictionary mediaResource = redition.getAsDictionary(PdfName.C);
                PdfDictionary mediaClipData = mediaResource.getAsDictionary(PdfName.D);
                PdfDictionary fileSpec = mediaResource.getAsDictionary(PdfName.D);
                PdfObject fileContent = fileSpec.getAsDictionary(PdfName.EF).get(PdfName.F);
                byte fileBytes[] = ((PdfStream) fileContent).getBytes();

                // System.out.println();
                audioOutputFile.append(pageNumber + " " + screenObjectNumber + " " + absoluteScreenLeft + " " + absoluteScreenTop + " " + absoluteScreenWidth + " " + absoluteScreenHeight + System.lineSeparator());

                try (FileOutputStream fos = new FileOutputStream(outputFolderName + "\\" + screenObjectNumber + ".mp3")) {
                    fos.write(fileBytes);
                    fos.close();
                }
            }

            audioOutputFile.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
    }
}
