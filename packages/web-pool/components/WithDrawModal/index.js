import React from "react";
import {
  Modal,
  Button,
  TradeForm,
  RadioButtonGroup,
  TokenGroup,
  Token,
} from "@onekeyhq/ui-components";
import { TransactionSettings, DescriptionList } from "../index";

const AddLiquidityModal = ({ visible, onClose }) => {
  const [selectedPercentage, setSelectedPercentage] = React.useState("25%");

  return (
    <>
      <Modal visible={visible} onClose={onClose} className="sm:!max-w-md">
        <Modal.Header
          title="Withdraw"
          onClose={onClose}
          actions={
            <div className="okd-flex okd-space-x-6">
              <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                <Button circular type="plain" leadingIcon="RefreshSolid" />
              </div>
              <div className="okd-flex okd-w-5 okd-h-5 okd-items-center okd-justify-center">
                <TransactionSettings priceSlippage gas />
              </div>
            </div>
          }
        />
        <Modal.Body>
          <div className="space-y-6">
            <TradeForm
              label="From"
              labelCorner={
                <RadioButtonGroup
                  value={selectedPercentage}
                  onChange={setSelectedPercentage}
                  label="example"
                  size="xs"
                >
                  <RadioButtonGroup.Option value="25%" label="25%" />
                  <RadioButtonGroup.Option value="50%" label="50%" />
                  <RadioButtonGroup.Option value="100%" label="100%" />
                </RadioButtonGroup>
              }
            >
              <TradeForm.Input
                placeholder="0.0"
                showBalance
                showRate
                valueType={
                  <div className="okd-flex okd-items-center">
                    <TokenGroup
                      cornerToken={{ chain: "asdfasdfsf" }}
                      description="something"
                      sources={[
                        { chain: "bsc", name: "BSC" },
                      ]}
                    />
                  </div>
                }
              ></TradeForm.Input>
            </TradeForm>
            <TradeForm label="To">
              <TradeForm.Input
                readOnly
                value="5.4651"
                valueType={
                  <div className="okd-flex okd-items-center">
                    <Token chain="bsc" name="BSC" />
                  </div>
                }
              />
            </TradeForm>
            <DescriptionList>
              <DescriptionList.Item
                itemKey="Minimum Received"
                itemValue="5.35167"
              />
              <DescriptionList.Item itemKey="Speed" itemValue="Fast" />
            </DescriptionList>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-3">
            <Button className="flex-1" type="primary">
              Approve
            </Button>
            <Button className="flex-1" disabled type="primary">
              Withdraw
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddLiquidityModal;
