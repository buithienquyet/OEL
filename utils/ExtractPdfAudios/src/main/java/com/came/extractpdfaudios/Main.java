/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.came.extractpdfaudios;

/**
 *
 * @author quyet
 */
public class Main {
    public static void main(String[] args) {
        if (args.length != 2)
        {
            System.err.println("Number of paramaters is not valid");
            System.exit(1);
        }
        
        String fileLocation = args[0];
        String outputFolder = args[1];
                
//        System.out.println(args[0]);
        Tool.GetAudiosFromPdf(fileLocation, outputFolder);
    }
}
