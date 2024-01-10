import {Component, OnInit} from '@angular/core';
import {CategoryService} from "@services/admin/categories/category.service";
import {Category} from "@models/post/category";

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {
  categoryName!: string;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  save() {
    if (this.categoryName) {
      this.categoryService.createCategory({
        categoryName: this.categoryName
      } as Category)
        .subscribe();
    }
  }
}
