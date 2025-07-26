## Property Mapping Table: Measurements to MeasurementData

| `Measurements` Property | `MeasurementData` Property | Notes |
|--------------------------------|---------------------------------------|-------|
| `chest`                        | `volume_params.chest`                 | Chest circumference (now in volume_params) |
| `stomach`                      | `volume_params.waist`                 | Waist circumference (frontal measurement) |
| `seat`                         | `volume_params.low_hips`              | Hip circumference (more precise measurement) |
| `bicep`                        | `volume_params.bicep`                 | Bicep circumference (more precise measurement) *!* |
| `sleeveLengthL`                | `front_params.sleeve_length`          | Assumes same value for both arms |
| `sleeveLengthR`                | `front_params.sleeve_length`          | Same as left side in 3DLook data |
| `backLength`                   | `front_params.new_jacket_length`          | Back length from neck |
| `shoulder`                     | `front_params.shoulders`              | Shoulder width |
| `wrist`                        | `volume_params.wrist`                 | Wrist circumference *!* |
| `neck`                         | `volume_params.neck`                  | Neck circumference *!* |
| `pantsWaist`                   | `volume_params.high_hips`             | Pants hip circumference |
| `hipsSeat`                     | `volume_params.low_hips`              | Hip seat circumference (same as `stomach`) |
| `thigh`                        | `volume_params.thigh`                 | Thigh circumference |
| `uCrotch`                      | `front_params.crotch_length`          | Crotch length |
| `pantsLengthL`                 | `front_params.outseam`                | Outer leg length |
| `pantsLengthR`                 | `front_params.outseam`                | Same as left side |
| `knee`                         | `volume_params.knee`                  | Knee circumference *!*|
| `calfBottom`                   | `volume_params.calf`                  | Calf circumference |
| `waistCoatBackLength`          | `front_params.new_jacket_length`          | Jacket/waistcoat length (same as `backLength`) |

### Key Observations:
1. **Symmetrical Measurements**: 3DLook typically provides symmetrical measurements (same value for both sides) unless detectable asymmetry exists
2. **Structural Differences**: 
   - Old `Measurements` used flat structure
   - New `MeasurementData` organizes measurements hierarchically (front_params, side_params, volume_params)
3. **Enhanced Precision**: The new structure provides more detailed and professional measurements