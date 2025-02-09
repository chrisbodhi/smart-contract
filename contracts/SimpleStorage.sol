// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract SimpleStorage {
    uint256 storedData;
    event DataStored(uint256 data);

    function set(uint256 data) external {
        storedData = data;
        emit DataStored(data);
    }

    function get() external view returns (uint256) {
        return storedData;
    }
}
