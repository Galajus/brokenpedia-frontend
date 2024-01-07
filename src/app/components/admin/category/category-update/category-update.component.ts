import {Component, OnInit} from '@angular/core';
import {Category} from "../../../../models/post/category";
import {CategoryService} from "../../../../services/admin/categories/category.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {

  categoryName!: string;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    let categoryId = this.route.snapshot.params['id'];
    this.categoryService.getCategory(categoryId)
      .subscribe(cat => this.categoryName = cat.categoryName);
  }

  save() {
    if (this.categoryName) {
      this.categoryService.updateCategory({
        id: this.route.snapshot.params['id'],
        categoryName: this.categoryName
      } as Category)
        .subscribe();
    }
  }

}
