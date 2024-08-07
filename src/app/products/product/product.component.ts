import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Backdrop, Decoration, Product, Prop } from '../interfaces/productInterface';
import { ShoppingCartService } from 'src/app/clients/shopping-cart/shopping-cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent{

  // product!:  Prop | Backdrop | Decoration;
  product: any;

  selectedImage: string = '';
  selectedColor: string = '';
  selectedSize: string = '';
  productId: string = '';
  loading: boolean = true;

  constructor(public router: Router, private productService: ProductsService, private route: ActivatedRoute, private shoppingCartService: ShoppingCartService){
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProductDetails(params['id']);
      }
    });
  }

  loadProductDetails(id: string): void {
    let category = this.router.url.slice(11).split('/')[0];
    let product = this.productService.getProduct(category, id);
    product.subscribe(
      (product: any) => {
        this.product = product;
        if (product && product.imagenes && product.imagenes.length > 0) {
          this.selectedImage = product.imagenes[0];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
        this.loading = false;
      }
    );
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  formatPrice(price: number): string {
    const formattedPrice = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    return '$' + formattedPrice.replace('US$', '');
  }

  isProp(product: Product): product is Prop {
    return (product as Prop).colors !== undefined;
}

  addToCart(product: any){
    let item = {
      ...product,
      color: this.selectedColor,
      size: this.selectedSize
    }
    this.shoppingCartService.addProduct(item);
    Swal.fire({
      position: "bottom",
      title: "Producto añadido al carrito",
      showConfirmButton: false,
      timer: 1500,
      backdrop: false
    });
  }
}
