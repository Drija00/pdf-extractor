import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { PDFDocument } from "pdf-lib";
import {MatSelectModule} from '@angular/material/select';
import { Form, FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import PdfParse from 'pdf-parse';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,MatTooltipModule,MatSelectModule,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  numOfPagesArr: number[] = [];

  constructor (private router: Router, private _formBuilder:FormBuilder){
  }

  redirectToLogin = () => {this.router.navigate(["/login"]);}
  public uint8array:any;
  public numOfPages:number =0;
  public startPage:any =0;
  public endPage:any =0;
  public pdfSrcDoc:any;
  public pdfNewDoc:any;
  public pdfArrayBuffer:any;
  public pdfName:string="";


  public fileToUpload:File|undefined;

  /*handleFileInput(event:any) {
    const fileList: FileList = event.target.files;
    console.log(fileList[0]);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileToUpload = file;
      console.log(this.fileToUpload+"aAAAAAAAAAAAAA");
    }
  }*/
  getNumPagesArray(){
    return this.range(1,this.numOfPages)
  }

  isPageDisabled(page: number): boolean {
    return page < this.startPage;
  }

  printNgModel(){
    console.log(this.startPage)
  }
  promena(e:any){
    this.isPageDisabled(e);
  }
  
    range(start:number,end:number):number[]{
      let result = new Array;
      for(let i=start;i<=end;i++){
        result.push(i); 
      }
      return result;
    }
  
    readFileAsync(file:any) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
        console.log(reader);
      });
    }

    async loadPdf(arrayBuff:any){
      console.log("1");
      this.pdfSrcDoc = await PDFDocument.load(this.pdfArrayBuffer);
      this.numOfPages =  this.pdfSrcDoc.getPageCount()
      this.numOfPagesArr =  this.getNumPagesArray()
      console.log(this.numOfPages);
    }
    
    async extractPdfPage(arrayBuff:any) {
      this.pdfNewDoc = await PDFDocument.create();
      console.log("3");
      console.log(this.pdfSrcDoc);
      console.log(this.pdfNewDoc);
      
      console.log(this.numOfPages)
      console.log(this.numOfPagesArr);
      let start = this.startPage;
      let end = this.endPage;
      const pages = await this.pdfNewDoc.copyPages(this.pdfSrcDoc,this.range(--start,--end));
      console.log(pages.length);
      await pages.forEach((page: any)=>this.pdfNewDoc.addPage(page));
      console.log(this.pdfNewDoc);
      const newpdf= await this.pdfNewDoc.save();
      console.log(newpdf);

      this.uint8array = newpdf;
      
    }

    async renderPdf() {
      await this.extractPdfPage(this.pdfArrayBuffer);
      //this.uint8array = newPdfDoc;
      console.log(this.numOfPages)
      console.log(this.numOfPagesArr);
      console.log(this.uint8array);
      const tempblob = new Blob([this.uint8array], {
        type: "application/pdf",
      });
      const docUrl = URL.createObjectURL(tempblob);
        window.open(docUrl, '_blank');  
        console.log(this.startPage);
        console.log(this.endPage);
    }

    onFileSelected = async (e:any) => {
      const fileList: FileList = e.target.files;
      if (fileList?.length > 0) {
        this.pdfArrayBuffer = await this.readFileAsync(fileList[0]);
        await this.loadPdf(this.pdfArrayBuffer)
        this.pdfName=fileList[0].name;
        console.log(this.pdfName)
      }
    };

    isButtonEnabled(){
      return this.startPage<=this.endPage && this.pdfSrcDoc!=null;
    }

}
