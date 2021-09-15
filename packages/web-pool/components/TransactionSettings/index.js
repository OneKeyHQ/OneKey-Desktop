import React, { useState } from "react";
import {
  Popover,
  Button,
  RadioButtonGroup,
  Input,
} from "@onekeyhq/ui-components";
import SettingsItem from "./SettingsItem";
import { DescriptionList } from "../index";

const PriceSlippage = ({}) => {
  const [selected, setSelected] = useState(0.1);

  return (
    <SettingsItem
      title="Price Slippage"
      description="The maximum percentage you are willing to lose due to unfavorable price
    changes."
    >
      <div className="flex items-center">
        <RadioButtonGroup
          value={selected}
          onChange={setSelected}
          label="Price Slippage"
        >
          <RadioButtonGroup.Option value={0.1} label="0.1%" />
          <RadioButtonGroup.Option value={0.5} label="0.5%" />
          <RadioButtonGroup.Option value={1} label="1%" />
        </RadioButtonGroup>
        <Input
          value={selected}
          addonAfter={"%"}
          className="w-20 ml-2"
          paddingRight={32}
        />
      </div>
      <DescriptionList className="mt-3">
        <DescriptionList.Item
          itemKey="Minimum Received"
          itemValue="5.35167"
        />
      </DescriptionList>
    </SettingsItem>
  );
};

const Gas = ({}) => {
  const [selected, setSelected] = useState(6);

  return (
    <SettingsItem
      title="Gas Setting"
      description="Gas affects the speed of transactions."
    >
      <RadioButtonGroup
        value={selected}
        onChange={setSelected}
        label="Price Slippage"
        className="w-full"
      >
        <RadioButtonGroup.Option
          value={6}
          label="Standard"
          description="6 Gwei"
          className="flex-1"
        />
        <RadioButtonGroup.Option
          value={10}
          label="Fast"
          description="10 Gwei"
          className="flex-1"
        />
        <RadioButtonGroup.Option
          value={15}
          label="Rapid"
          description="15 Gwei"
          className="flex-1"
        />
      </RadioButtonGroup>
      <Input
        className="mt-2"
        value={selected}
        addonAfter={"Gwei"}
        paddingRight={32}
      />
    </SettingsItem>
  );
};

const TransactionSettings = ({ priceSlippage, gas }) => {
  return (
    <Popover
      className="!w-auto"
      trigger={(status) => (
        <Button
          circular
          type="plain"
          leadingIcon="CogSolid"
          className={status && "bg-gray-100"}
        />
      )}
    >
      <div className="p-4 space-y-8 text-sm">
        {priceSlippage && <PriceSlippage />}
        {gas && <Gas />}
      </div>
    </Popover>
  );
};

export default TransactionSettings;
