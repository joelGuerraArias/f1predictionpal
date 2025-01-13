interface AdditionalPredictionsProps {
  rain: boolean;
  dnf: boolean;
  safetyCar: boolean;
  onPredictionChange: (field: 'rain' | 'dnf' | 'safetyCar', value: boolean) => void;
}

export const AdditionalPredictions = ({
  rain,
  dnf,
  safetyCar,
  onPredictionChange,
}: AdditionalPredictionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold">LLUVIA</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="rain"
              className="form-radio text-f1-red"
              checked={rain}
              onChange={() => onPredictionChange('rain', true)}
            />
            <span>SI</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="rain"
              className="form-radio text-f1-red"
              checked={!rain}
              onChange={() => onPredictionChange('rain', false)}
            />
            <span>NO</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-bold">ABANDONOS</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="dnf"
              className="form-radio text-f1-red"
              checked={dnf}
              onChange={() => onPredictionChange('dnf', true)}
            />
            <span>SI</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="dnf"
              className="form-radio text-f1-red"
              checked={!dnf}
              onChange={() => onPredictionChange('dnf', false)}
            />
            <span>NO</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-bold">SAFETY CAR</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="safetyCar"
              className="form-radio text-f1-red"
              checked={safetyCar}
              onChange={() => onPredictionChange('safetyCar', true)}
            />
            <span>SI</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="safetyCar"
              className="form-radio text-f1-red"
              checked={!safetyCar}
              onChange={() => onPredictionChange('safetyCar', false)}
            />
            <span>NO</span>
          </label>
        </div>
      </div>
    </div>
  );
};