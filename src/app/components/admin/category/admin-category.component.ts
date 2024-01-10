import {Component, OnInit} from '@angular/core';
import {CategoryService} from "@services/admin/categories/category.service";
import {Category} from "@models/post/category";

@Component({
  selector: 'app-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  displayedColumns: string[] = ["id", "categoryName", "categorySlug", "actions"];
  dataSource: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe(cats => this.dataSource = cats);
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id)
      .subscribe(() => {
        this.dataSource = this.dataSource.filter(c => {
          return c.id !== id;
        });
      });
  }
}
