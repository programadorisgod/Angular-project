import { Component, inject } from '@angular/core'
import { HousingLocationComponent } from '../housing-location/housing-location.component'

import { CommonModule } from '@angular/common'
import { HousingService } from '../housing.service'
import { HousingLocation } from '../housinglocation'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  template: `
    <section>
      <form (submit)="$event.preventDefault()">
        <input
          type="text"
          placeholder="Filter by city"
          #filter
          (keyup)="filterResults($event)"
        />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Search
        </button>
      </form>
    </section>

    <section class="results">
      @for (housingLocation of filteredLocationList; track housingLocation.id){
      <app-housing-location
        [housingLocation]="housingLocation"
      ></app-housing-location>
      }@empty {
      <p>HousingLocations empty</p>
      }
    </section>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = []
  housingService: HousingService = inject(HousingService)
  filteredLocationList: HousingLocation[] = []

  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList) => {
      this.housingLocationList = housingLocationList
      this.filteredLocationList = housingLocationList
    })
  }

  filterResults(text: string | Event) {
    let newText = ''

    if (typeof text === 'string') {
      newText = text
    } else {
      newText = (text.target as HTMLInputElement).value
    }

    if (!newText) {
      this.filteredLocationList = this.housingLocationList
    }
    this.filteredLocationList = this.housingLocationList.filter(
      (housingLocation) =>
        housingLocation?.city.toLowerCase().includes(newText.toLowerCase())
    )
  }
}
